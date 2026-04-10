package com.banking.transaction.controller;

import com.banking.transaction.model.Transaction;
import com.banking.transaction.model.TransactionRequest;
import com.banking.transaction.model.TransactionResponse;
import com.banking.transaction.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/send-money")
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody TransactionRequest request,
            @RequestHeader("Authorization") String token ) {
        return ResponseEntity.ok(transactionService.processTransaction(request, token));
    }

    @GetMapping("/history/{account}")
    public ResponseEntity<List<Transaction>> getHistory(@PathVariable String account) {
        return ResponseEntity.ok(transactionService.getTransactionHistory(account));
    }
}
