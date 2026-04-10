package com.banking.transaction.service;

import com.banking.transaction.model.BalanceUpdateRequest;
import com.banking.transaction.model.Transaction;
import com.banking.transaction.model.TransactionRequest;
import com.banking.transaction.model.TransactionResponse;
import com.banking.transaction.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private TransactionService transactionService;

    private TransactionRequest transferRequest;
    private TransactionRequest depositRequest;
    private TransactionRequest withdrawRequest;

    @BeforeEach
    void setUp() {
        transferRequest = new TransactionRequest();
        transferRequest.setFromAccount("ACC001");
        transferRequest.setToAccount("ACC002");
        transferRequest.setAmount(500.0);
        transferRequest.setType("TRANSFER");

        depositRequest = new TransactionRequest();
        depositRequest.setFromAccount("ACC001");
        depositRequest.setToAccount("ACC003");
        depositRequest.setAmount(200.0);
        depositRequest.setType("DEPOSIT");

        withdrawRequest = new TransactionRequest();
        withdrawRequest.setFromAccount("ACC001");
        withdrawRequest.setToAccount("ACC001");
        withdrawRequest.setAmount(100.0);
        withdrawRequest.setType("WITHDRAW");
    }

    // ─── TRANSFER ─────────────────────────────────────────────────────────────

    @Test
    void processTransaction_transfer_success() {
        Transaction saved = new Transaction();
        saved.setId(1L);
        saved.setStatus("SUCCESS");

        when(restTemplate.postForEntity(contains("/debit"), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));
        when(restTemplate.postForEntity(contains("/credit"), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(saved);

        TransactionResponse response = transactionService.processTransaction(transferRequest, "Bearer token");

        assertThat(response.getStatus()).isEqualTo("SUCCESS");
        assertThat(response.getMessage()).isEqualTo("Transaction completed");
        assertThat(response.getTransactionId()).isEqualTo(1L);

        // Verify both debit and credit were called
        verify(restTemplate, times(1)).postForEntity(contains("/debit"), any(HttpEntity.class), eq(String.class));
        verify(restTemplate, times(1)).postForEntity(contains("/credit"), any(HttpEntity.class), eq(String.class));
    }

    @Test
    void processTransaction_transfer_savesTransactionWithSuccessStatus() {
        Transaction saved = new Transaction();
        saved.setId(10L);

        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(saved);

        transactionService.processTransaction(transferRequest, "Bearer token");

        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo("SUCCESS");
        assertThat(captor.getValue().getFromAccount()).isEqualTo("ACC001");
        assertThat(captor.getValue().getToAccount()).isEqualTo("ACC002");
        assertThat(captor.getValue().getAmount()).isEqualTo(500.0);
    }

    @Test
    void processTransaction_transfer_restTemplateThrows_returnsFailed() {
        Transaction saved = new Transaction();
        saved.setId(2L);

        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(String.class)))
                .thenThrow(new RuntimeException("Network error"));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(saved);

        TransactionResponse response = transactionService.processTransaction(transferRequest, "Bearer token");

        assertThat(response.getStatus()).isEqualTo("FAILED");
        assertThat(response.getMessage()).contains("Transaction failed");
        // Verify failed transaction is still saved
        verify(transactionRepository).save(any(Transaction.class));
    }

    // ─── DEPOSIT ──────────────────────────────────────────────────────────────

    @Test
    void processTransaction_deposit_success() {
        Transaction saved = new Transaction();
        saved.setId(3L);

        when(restTemplate.postForEntity(contains("/credit"), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(saved);

        TransactionResponse response = transactionService.processTransaction(depositRequest, "Bearer token");

        assertThat(response.getStatus()).isEqualTo("SUCCESS");
        // Debit should NOT be called for a deposit
        verify(restTemplate, never()).postForEntity(contains("/debit"), any(HttpEntity.class), eq(String.class));
        verify(restTemplate, times(1)).postForEntity(contains("/credit"), any(HttpEntity.class), eq(String.class));
    }

    @Test
    void processTransaction_deposit_lowercase_success() {
        depositRequest.setType("deposit");

        Transaction saved = new Transaction();
        saved.setId(4L);

        when(restTemplate.postForEntity(contains("/credit"), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(saved);

        TransactionResponse response = transactionService.processTransaction(depositRequest, "Bearer token");

        assertThat(response.getStatus()).isEqualTo("SUCCESS");
    }

    // ─── WITHDRAW ─────────────────────────────────────────────────────────────

    @Test
    void processTransaction_withdraw_success() {
        Transaction saved = new Transaction();
        saved.setId(5L);

        when(restTemplate.postForEntity(contains("/debit"), any(HttpEntity.class), eq(String.class)))
                .thenReturn(ResponseEntity.ok("ok"));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(saved);

        TransactionResponse response = transactionService.processTransaction(withdrawRequest, "Bearer token");

        assertThat(response.getStatus()).isEqualTo("SUCCESS");
        verify(restTemplate, times(1)).postForEntity(contains("/debit"), any(HttpEntity.class), eq(String.class));
        verify(restTemplate, never()).postForEntity(contains("/credit"), any(HttpEntity.class), eq(String.class));
    }

    // ─── INVALID TYPE ─────────────────────────────────────────────────────────

    @Test
    void processTransaction_invalidType_returnsFailed() {
        TransactionRequest badRequest = new TransactionRequest();
        badRequest.setFromAccount("ACC001");
        badRequest.setToAccount("ACC002");
        badRequest.setAmount(100.0);
        badRequest.setType("UNKNOWN");

        TransactionResponse response = transactionService.processTransaction(badRequest, "Bearer token");

        assertThat(response.getStatus()).isEqualTo("FAILED");
        assertThat(response.getMessage()).isEqualTo("Invalid transaction type");
        assertThat(response.getTransactionId()).isNull();
        verifyNoInteractions(transactionRepository);
    }

    @Test
    void processTransaction_emptyType_returnsFailed() {
        TransactionRequest badRequest = new TransactionRequest();
        badRequest.setFromAccount("ACC001");
        badRequest.setToAccount("ACC002");
        badRequest.setAmount(100.0);
        badRequest.setType("");

        TransactionResponse response = transactionService.processTransaction(badRequest, "Bearer token");

        assertThat(response.getStatus()).isEqualTo("FAILED");
        assertThat(response.getMessage()).isEqualTo("Invalid transaction type");
    }

    // ─── HISTORY ──────────────────────────────────────────────────────────────

    @Test
    void getTransactionHistory_returnsTransactionsForAccount() {
        Transaction t1 = new Transaction();
        t1.setId(1L);
        t1.setFromAccount("ACC001");

        Transaction t2 = new Transaction();
        t2.setId(2L);
        t2.setFromAccount("ACC001");

        when(transactionRepository.findByFromAccount("ACC001")).thenReturn(List.of(t1, t2));

        List<Transaction> result = transactionService.getTransactionHistory("ACC001");

        assertThat(result).hasSize(2);
        assertThat(result).extracting(Transaction::getFromAccount).containsOnly("ACC001");
    }

    @Test
    void getTransactionHistory_noTransactions_returnsEmptyList() {
        when(transactionRepository.findByFromAccount("EMPTY")).thenReturn(List.of());

        List<Transaction> result = transactionService.getTransactionHistory("EMPTY");

        assertThat(result).isEmpty();
    }
}
