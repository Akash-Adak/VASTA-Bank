package com.banking.payment.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import com.banking.payment.dto.BalanceUpdateRequest;
import com.banking.payment.dto.PaymentOrder;
import com.banking.payment.repository.PaymentOrderRepo;
import com.banking.payment.util.PaymentVerificationUtil;
import com.razorpay.RazorpayException;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PaymentOrderRepo orderRepo;

    @PostMapping("/create-order")
    public Map<String, String> createOrder(@RequestBody Map<String, Object> requestData) throws RazorpayException {

        Object amtObj = requestData.get("amount");

        if (amtObj == null) {
            throw new IllegalArgumentException("Amount is required");
        }

        BigDecimal amount = new BigDecimal(amtObj.toString());

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid amount");
        }

        RazorpayClient razorpay = new RazorpayClient(razorpayKey, razorpaySecret);

        int amountInPaise = amount.multiply(new BigDecimal("100")).intValueExact();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);

        PaymentOrder po = new PaymentOrder();
        po.setOrderId(order.get("id"));
        po.setAmount(amount);
        po.setAccountNumber(requestData.get("accountNumber").toString());
        po.setStatus("CREATED");

        orderRepo.save(po);

        Map<String, String> response = new HashMap<>();
        response.put("orderId", order.get("id").toString());
        response.put("amount", order.get("amount").toString());
        response.put("currency", order.get("currency").toString());
        response.put("key", razorpayKey);

        return response;
    }


    @PostMapping("/verify")
    public Map<String, Object> verifyPayment(
            @RequestBody Map<String, String> body,
            HttpServletRequest request
    ) {

        String orderId = body.get("orderId");
        String paymentId = body.get("paymentId");
        String signature = body.get("signature");

        String token = request.getHeader("Authorization");

        Map<String, Object> response = new HashMap<>();

        // 1️⃣ Verify Signature
        boolean verified =
                PaymentVerificationUtil.verifySignature(
                        orderId,
                        paymentId,
                        signature,
                        razorpaySecret
                );

        if (!verified) {
            response.put("success", false);
            response.put("message", "Invalid Signature");
            return response;
        }

        try {

            // 2️⃣ Fetch Order from DB
            PaymentOrder order =
                    orderRepo.findById(orderId)
                            .orElseThrow(() ->
                                    new RuntimeException("Order not found"));

            if ("PAID".equals(order.getStatus())) {
                throw new RuntimeException("Already processed");
            }

            // 3️⃣ Verify with Razorpay Server
            RazorpayClient razorpay =
                    new RazorpayClient(
                            razorpayKey,
                            razorpaySecret
                    );

            com.razorpay.Payment payment =
                    razorpay.payments.fetch(paymentId);

            String status = payment.get("status");

            int paidAmount =
                    payment.get("amount");

            if (!"captured".equals(status)) {
                throw new RuntimeException("Payment not captured");
            }

            // 4️⃣ Match Amount
            BigDecimal realAmount =
                    BigDecimal.valueOf(paidAmount)
                            .divide(new BigDecimal("100"));

            if (order.getAmount().compareTo(realAmount) != 0) {
                throw new RuntimeException("Amount mismatch");
            }

            // 5️⃣ Credit Account
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            BalanceUpdateRequest req =
                    new BalanceUpdateRequest(
                            order.getAccountNumber(),
                            realAmount
                    );

            HttpEntity<?> entity =
                    new HttpEntity<>(req, headers);

            restTemplate.exchange(
                    "http://ACCOUNT/api/accounts/credit",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // 6️⃣ Mark as PAID
            order.setStatus("PAID");
            orderRepo.save(order);

            response.put("success", true);
            response.put("message", "Money added");

        } catch (Exception e) {

            e.printStackTrace();

            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }


}
