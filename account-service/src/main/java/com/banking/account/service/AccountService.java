package com.banking.account.service;

import com.banking.account.model.Account;
import com.banking.account.model.AccountRequest;
import com.banking.account.model.AccountType;
import com.banking.account.model.IdentityRegistry;
import com.banking.account.repository.AccountRepository;
import com.banking.account.response.RegisterRequestResponse;
import com.banking.account.response.UserResponse;
import com.banking.account.response.Token;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
@Service
//@Slf4j
public class AccountService {
    @Autowired
    private  AccountRepository repository;


    @Autowired
   private  RestTemplate restTemplate;
    @Autowired
   private  KafkaProducerService kafkaProducerService;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedisService redisService;

    public Account createAccount(String username, String token, AccountRequest accountRequest) {

        // Check if user already has an account
        if (repository.findByUsername(username).isPresent()) return null;

        // Create new account
        Account account = new Account();
        account.setAccountNumber(generateBankAccountNumber());
        account.setBalance(BigDecimal.valueOf(1000.0));
        account.setUsername(username);
        account.setAccountType(accountRequest.getType());
        // ✅ Add proper headers
        IdentityRegistry identityRegistry = new IdentityRegistry();
        identityRegistry.setFullname(accountRequest.getFullname());
        identityRegistry.setDob(accountRequest.getDob());
        identityRegistry.setDocHash(accountRequest.getDocHash());
        identityRegistry.setDocType(accountRequest.getDocType());
        identityRegistry.setAccountNumber(account.getAccountNumber());
        identityRegistry.setUsername(username);
        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization" , token);

        HttpEntity<IdentityRegistry> entity = new HttpEntity<>(identityRegistry,headers);

        // ✅ Update user with new account number

        ResponseEntity<UserResponse> response = restTemplate.exchange(
                "http://USER/api/users",
                HttpMethod.PUT,
                entity,
                UserResponse.class
                );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Failed to update user with account number");
        }

        UserResponse userResponse = response.getBody();

        // ✅ Send Kafka notification
        RegisterRequestResponse event = new RegisterRequestResponse();
//        String username = userResponse.getUsername();
        String fullname = userResponse.getFullname();
        String email = userResponse.getEmail();

// Email subject
        String subject = "🎉 Account Created Successfully – Welcome " + fullname + "!";

// HTML Email body
        String body =
                "<!DOCTYPE html>" +
                        "<html lang='en'>" +
                        "<head>" +
                        "  <meta charset='UTF-8'>" +
                        "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                        "  <title>VASTA Bank | Account Created</title>" +
                        "</head>" +
                        "<body style='margin:0; padding:0; background-color:#f2f4f7; font-family:Arial, Helvetica, sans-serif;'>" +

                        "  <table width='100%' cellpadding='0' cellspacing='0'>" +
                        "    <tr>" +
                        "      <td align='center' style='padding:30px 10px;'>" +

                        "        <table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;'>" +

                        "          <!-- Header -->" +
                        "          <tr>" +
                        "            <td style='background:#0a3cff; padding:20px; text-align:center;'>" +
                        "              <img src='assets/vasta-bank-logo.png' alt='VASTA Bank Logo' style='max-width:120px; margin-bottom:10px;'>" +
                        "              <h1 style='color:#ffffff; margin:0; font-size:22px;'>Welcome to VASTA Bank</h1>" +
                        "            </td>" +
                        "          </tr>" +

                        "          <!-- Content -->" +
                        "          <tr>" +
                        "            <td style='padding:25px; color:#333333; font-size:15px; line-height:1.6;'>" +
                        "              <p>Dear <strong>" + fullname + "</strong>,</p>" +

                        "              <p>Your bank account has been <strong>successfully created</strong> with <strong>VASTA Bank</strong>.</p>" +

                        "              <p>You can now enjoy:</p>" +
                        "              <ul style='padding-left:18px;'>" +
                        "                <li>Secure access to your account</li>" +
                        "                <li>Real-time balance and transaction tracking</li>" +
                        "                <li>Fast and safe digital banking services</li>" +
                        "              </ul>" +

                        "              <p style='text-align:center; margin:30px 0;'>" +
                        "                <a href='#' style='background:#0a3cff; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;'>Access Your Account</a>" +
                        "              </p>" +

                        "              <p>If you have any questions, our support team is always here to help.</p>" +

                        "              <p>Thank you for trusting <strong>VASTA Bank</strong>.</p>" +
                        "              <p style='margin-top:20px;'><strong>— Team VASTA</strong></p>" +
                        "            </td>" +
                        "          </tr>" +

                        "          <!-- Footer -->" +
                        "          <tr>" +
                        "            <td style='background:#f7f7f7; padding:15px; text-align:center; font-size:12px; color:#777777;'>" +
                        "              © 2026 VASTA Bank. All rights reserved.<br>" +
                        "              Secure • Reliable • Digital Banking" +
                        "            </td>" +
                        "          </tr>" +

                        "        </table>" +
                        "      </td>" +
                        "    </tr>" +
                        "  </table>" +

                        "</body>" +
                        "</html>";


// Set the event for Kafka or email sending
        event.setUsername(subject); // Email subject
        event.setEmail(email);       // Recipient email
        event.setBody(body);         // HTML email body


        String json = new Gson().toJson(event);
        kafkaProducerService.sendLoginSuccess("banking-users", json);

        // ✅ Save account in local repository
        return repository.save(account);
    }


    private String generateBankAccountNumber() {
        String bankCode = "8940";
        long randomPart = ThreadLocalRandom.current().nextLong(1000000000L, 9999999999L); // 10-digit number
        return bankCode + randomPart;
    }


    public Account getUserByAccountNumber(String accountNumber) {
        return repository.findByAccountNumber(accountNumber);
    }


    public boolean debit(String accountNumber, BigDecimal amount,String token) {
        Optional<Account> optional = Optional.ofNullable(repository.findByAccountNumber(accountNumber));
        if (optional.isPresent()) {
            Account account = optional.get();
            if (account.getBalance().compareTo(amount) >= 0) {
                account.setBalance(account.getBalance().subtract(amount));

                repository.save(account);

                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization",token );

                HttpEntity<Void> entity = new HttpEntity<>(headers);

                ResponseEntity<UserResponse> response = restTemplate.exchange(
                        "http://USER/api/users/get-by-account/{accountNumber}",
                        HttpMethod.GET,
                        entity,
                        UserResponse.class,
                        accountNumber
                );
                UserResponse userResponse=response.getBody();
                RegisterRequestResponse event = new RegisterRequestResponse();
                String fullname = userResponse.getFullname();
                String email = userResponse.getEmail();
                String maskedAccount = "xxxxxx" + accountNumber.substring(accountNumber.length() - 4); // Last 4 digits
                String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

// Email subject
                String subject = "💸 Amount Debited – ₹" + amount + " from your account";

// HTML Email body
                String body =
                        "<!DOCTYPE html>" +
                                "<html lang='en'>" +
                                "<head>" +
                                "  <meta charset='UTF-8'>" +
                                "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                                "  <title>VASTA Bank | Debit Alert</title>" +
                                "</head>" +

                                "<body style='margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, Helvetica, sans-serif;'>" +

                                "  <table width='100%' cellpadding='0' cellspacing='0'>" +
                                "    <tr>" +
                                "      <td align='center' style='padding:30px 10px;'>" +

                                "        <table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08);'>" +

                                "          <!-- Header -->" +
                                "          <tr>" +
                                "            <td style='background:#0a3cff; padding:18px; text-align:center;'>" +
                                "              <img src='assets/vasta-bank-logo.png' alt='VASTA Bank Logo' style='max-width:110px; margin-bottom:8px;'>" +
                                "              <h2 style='color:#ffffff; margin:0; font-size:20px;'>Debit Transaction Alert</h2>" +
                                "            </td>" +
                                "          </tr>" +

                                "          <!-- Content -->" +
                                "          <tr>" +
                                "            <td style='padding:24px; color:#333333; font-size:14.5px; line-height:1.6;'>" +

                                "              <p>Dear <strong>" + fullname + "</strong>,</p>" +

                                "              <p>A transaction has been <strong>successfully debited</strong> from your VASTA Bank account.</p>" +

                                "              <table width='100%' cellpadding='6' cellspacing='0' style='margin:15px 0; font-size:14px;'>" +
                                "                <tr>" +
                                "                  <td>Account Number</td>" +
                                "                  <td style='font-weight:bold; text-align:right;'>" + maskedAccount + "</td>" +
                                "                </tr>" +
                                "                <tr>" +
                                "                  <td>Amount Debited</td>" +
                                "                  <td style='font-weight:bold; text-align:right;'>₹" + amount + "</td>" +
                                "                </tr>" +
                                "                <tr>" +
                                "                  <td>Available Balance</td>" +
                                "                  <td style='font-weight:bold; text-align:right;'>₹" + account.getBalance() + "</td>" +
                                "                </tr>" +
                                "                <tr>" +
                                "                  <td>Transaction Date</td>" +
                                "                  <td style='text-align:right;'>" + formattedDate + "</td>" +
                                "                </tr>" +
                                "              </table>" +

                                "              <p>If you do not recognize this transaction, please contact VASTA Bank support immediately.</p>" +

                                "              <p style='margin-top:20px;'>Thank you for choosing <strong>VASTA Bank</strong>.</p>" +
                                "              <p><strong>— Team VASTA</strong></p>" +

                                "            </td>" +
                                "          </tr>" +

                                "          <!-- Footer -->" +
                                "          <tr>" +
                                "            <td style='background:#f7f7f7; padding:14px; text-align:center; font-size:12px; color:#777777;'>" +
                                "              © 2026 VASTA Bank. All rights reserved.<br>" +
                                "              Secure • Transparent • Digital Banking" +
                                "            </td>" +
                                "          </tr>" +

                                "        </table>" +

                                "      </td>" +
                                "    </tr>" +
                                "  </table>" +

                                "</body>" +
                                "</html>";

// Set Kafka or email event
                event.setUsername(subject); // Email subject
                event.setEmail(email);      // Recipient email
                event.setBody(body);        // HTML email body



                String json = new Gson().toJson(event);
                kafkaProducerService.sendLoginSuccess("banking-users", json);

                return true;
            }
        }
        return false;
    }

    public boolean credit(String accountNumber, BigDecimal amount, String token) {
        return Optional.ofNullable(repository.findByAccountNumber(accountNumber)).map(account -> {
            account.setBalance(account.getBalance().add(amount));
            repository.save(account);
//            log.info("Credited ₹{} to account {}", amount, accountNumber);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            try {
                ResponseEntity<UserResponse> response = restTemplate.exchange(
                        "http://USER/api/users/get-by-account/{accountNumber}",
                        HttpMethod.GET,
                        entity,
                        UserResponse.class,
                        accountNumber
                );

                UserResponse userResponse = response.getBody();
                if (userResponse == null) {
//                    log.error("User info missing in response for account {}", accountNumber);
                    return false;
                }

                RegisterRequestResponse event = new RegisterRequestResponse();
                String fullname = userResponse.getFullname();
                String email = userResponse.getEmail();
                String maskedAccount = "xxxxxx" + accountNumber.substring(accountNumber.length() - 4); // Last 4 digits
                String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

// Email subject
                String subject = "💰 Amount Credited – ₹" + amount + " to your account";

                String body =
                        "<!DOCTYPE html>" +
                                "<html lang='en'>" +
                                "<head>" +
                                "  <meta charset='UTF-8'>" +
                                "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                                "  <title>VASTA Bank | Credit Alert</title>" +
                                "</head>" +

                                "<body style='margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, Helvetica, sans-serif;'>" +

                                "  <table width='100%' cellpadding='0' cellspacing='0'>" +
                                "    <tr>" +
                                "      <td align='center' style='padding:30px 10px;'>" +

                                "        <table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08);'>" +

                                "          <!-- Header -->" +
                                "          <tr>" +
                                "            <td style='background:#0a3cff; padding:18px; text-align:center;'>" +
                                "              <img src='assets/vasta-bank-logo.png' alt='VASTA Bank Logo' style='max-width:110px; margin-bottom:8px;'>" +
                                "              <h2 style='color:#ffffff; margin:0; font-size:20px;'>Credit Transaction Alert</h2>" +
                                "            </td>" +
                                "          </tr>" +

                                "          <!-- Content -->" +
                                "          <tr>" +
                                "            <td style='padding:24px; color:#333333; font-size:14.5px; line-height:1.6;'>" +

                                "              <p>Dear <strong>" + fullname + "</strong>,</p>" +

                                "              <p>An amount has been <strong>successfully credited</strong> to your VASTA Bank account.</p>" +

                                "              <table width='100%' cellpadding='6' cellspacing='0' style='margin:15px 0; font-size:14px;'>" +
                                "                <tr>" +
                                "                  <td>Account Number</td>" +
                                "                  <td style='font-weight:bold; text-align:right;'>" + maskedAccount + "</td>" +
                                "                </tr>" +
                                "                <tr>" +
                                "                  <td>Amount Credited</td>" +
                                "                  <td style='font-weight:bold; text-align:right;'>₹" + amount + "</td>" +
                                "                </tr>" +
                                "                <tr>" +
                                "                  <td>Available Balance</td>" +
                                "                  <td style='font-weight:bold; text-align:right;'>₹" + account.getBalance() + "</td>" +
                                "                </tr>" +
                                "                <tr>" +
                                "                  <td>Transaction Date</td>" +
                                "                  <td style='text-align:right;'>" + formattedDate + "</td>" +
                                "                </tr>" +
                                "              </table>" +

                                "              <p>If you do not recognize this credit, please contact VASTA Bank support immediately.</p>" +

                                "              <p style='margin-top:20px;'>Thank you for banking with <strong>VASTA Bank</strong>.</p>" +
                                "              <p><strong>— Team VASTA</strong></p>" +

                                "            </td>" +
                                "          </tr>" +

                                "          <!-- Footer -->" +
                                "          <tr>" +
                                "            <td style='background:#f7f7f7; padding:14px; text-align:center; font-size:12px; color:#777777;'>" +
                                "              © 2026 VASTA Bank. All rights reserved.<br>" +
                                "              Secure • Transparent • Digital Banking" +
                                "            </td>" +
                                "          </tr>" +

                                "        </table>" +

                                "      </td>" +
                                "    </tr>" +
                                "  </table>" +

                                "</body>" +
                                "</html>";


// Set Kafka or email event
                event.setUsername(subject); // Email subject
                event.setEmail(email);      // Recipient email
                event.setBody(body);        // HTML email body

                String json = new Gson().toJson(event);
                kafkaProducerService.sendLoginSuccess("banking-users", json);

                return true;

            } catch (HttpClientErrorException | HttpServerErrorException ex) {
//                log.error("Failed to fetch user info for account {}: {}", accountNumber, ex.getMessage());
                return false;
            }

        }).orElse(false);
    }


    public BigDecimal getBalanceByAccountNumber(String accountNumber) {
        Account a= repository.findByAccountNumber(accountNumber);
        return a.getBalance();
    }

    @Transactional
    public void creditAmount(String accountNumber, BigDecimal amount) {

        Account account =
                repository.findByAccountNumber(accountNumber);


        account.setBalance(
                account.getBalance().add(amount));

        repository.save(account);
    }




    public boolean addMoneyAfterPayment(
            String accountNumber,
            BigDecimal amount,
            String token
    ) {

        return Optional.ofNullable(
                repository.findByAccountNumber(accountNumber)
        ).map(account -> {

            // 1️⃣ Update Balance
            account.setBalance(
                    account.getBalance().add(amount)
            );

            repository.save(account);

            // 2️⃣ Fetch User Info
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            try {

                ResponseEntity<UserResponse> response =
                        restTemplate.exchange(
                                "http://USER/api/users/get-by-account/{accountNumber}",
                                HttpMethod.GET,
                                entity,
                                UserResponse.class,
                                accountNumber
                        );

                UserResponse user = response.getBody();

                if (user == null) {
                    return false;
                }

                // 3️⃣ Send Notification
                sendAddMoneyNotification(user, account, amount);

                return true;

            } catch (Exception e) {

                return false;
            }

        }).orElse(false);
    }
    private void sendAddMoneyNotification(
            UserResponse user,
            Account account,
            BigDecimal amount
    ) {

        String maskedAccount =
                "xxxxxx" + account.getAccountNumber()
                        .substring(account.getAccountNumber().length() - 4);

        String date = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        String subject =
                "💰 Money Added Successfully – ₹" + amount;

        String body =
                "<html>" +
                        "<body style='font-family:Arial'>" +

                        "<h3>Hello " + user.getFullname() + ",</h3>" +

                        "<p>₹" + amount + " has been added to your wallet.</p>" +

                        "<p><b>Account:</b> " + maskedAccount + "</p>" +

                        "<p><b>Balance:</b> ₹" + account.getBalance() + "</p>" +

                        "<p><b>Date:</b> " + date + "</p>" +

                        "<br>" +
                        "<p>— Team VASTA Bank</p>" +

                        "</body>" +
                        "</html>";

        RegisterRequestResponse event =
                new RegisterRequestResponse();

        event.setUsername(subject);
        event.setEmail(user.getEmail());
        event.setBody(body);

        String json = new Gson().toJson(event);

        kafkaProducerService.sendLoginSuccess(
                "banking-users",
                json
        );
    }


}
