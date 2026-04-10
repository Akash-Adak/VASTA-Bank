package com.banking.account.service;

import com.banking.account.model.Account;
import com.banking.account.model.AccountRequest;
import com.banking.account.repository.AccountRepository;
import com.banking.account.response.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository repository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private KafkaProducerService kafkaProducerService;

    @Mock
    private RedisTemplate redisTemplate;

    @Mock
    private RedisService redisService;

    @InjectMocks
    private AccountService accountService;

    private Account sampleAccount;

    @BeforeEach
    void setUp() {
        sampleAccount = new Account();
        sampleAccount.setId(1L);
        sampleAccount.setAccountNumber("894012345678");
        sampleAccount.setBalance(new BigDecimal("5000.00"));
        sampleAccount.setUsername("john");
        sampleAccount.setAccountType("SAVINGS");
    }

    // ─── createAccount ────────────────────────────────────────────────────────

    @Test
    void createAccount_existingUser_returnsNull() {
        when(repository.findByUsername("john")).thenReturn(Optional.of(sampleAccount));

        AccountRequest req = new AccountRequest();
        req.setType("SAVINGS");

        Account result = accountService.createAccount("john", "Bearer token", req);

        assertThat(result).isNull();
        verify(repository, never()).save(any());
    }

    @Test
    void createAccount_newUser_savesAndReturnsAccount() {
        when(repository.findByUsername("john")).thenReturn(Optional.empty());

        UserResponse userResponse = new UserResponse();
        userResponse.setUsername("john");
        userResponse.setFullname("John Doe");
        userResponse.setEmail("john@example.com");

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.PUT), any(HttpEntity.class), eq(UserResponse.class)))
                .thenReturn(new ResponseEntity<>(userResponse, HttpStatus.OK));
        when(repository.save(any(Account.class))).thenReturn(sampleAccount);

        AccountRequest req = new AccountRequest();
        req.setType("SAVINGS");

        Account result = accountService.createAccount("john", "Bearer token", req);

        assertThat(result).isNotNull();
        verify(repository).save(any(Account.class));
    }

    @Test
    void createAccount_setsInitialBalanceTo1000() {
        when(repository.findByUsername("john")).thenReturn(Optional.empty());

        UserResponse userResponse = new UserResponse();
        userResponse.setUsername("john");
        userResponse.setFullname("John Doe");
        userResponse.setEmail("john@example.com");

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.PUT), any(HttpEntity.class), eq(UserResponse.class)))
                .thenReturn(new ResponseEntity<>(userResponse, HttpStatus.OK));
        when(repository.save(any(Account.class))).thenReturn(sampleAccount);

        AccountRequest req = new AccountRequest();
        req.setType("CURRENT");

        accountService.createAccount("john", "Bearer token", req);

        ArgumentCaptor<Account> captor = ArgumentCaptor.forClass(Account.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getBalance()).isEqualByComparingTo(new BigDecimal("1000.0"));
        assertThat(captor.getValue().getUsername()).isEqualTo("john");
        assertThat(captor.getValue().getAccountType()).isEqualTo("CURRENT");
    }

    // ─── getUserByAccountNumber ───────────────────────────────────────────────

    @Test
    void getUserByAccountNumber_returnsAccount() {
        when(repository.findByAccountNumber("894012345678")).thenReturn(sampleAccount);

        Account result = accountService.getUserByAccountNumber("894012345678");

        assertThat(result).isEqualTo(sampleAccount);
    }

    @Test
    void getUserByAccountNumber_notFound_returnsNull() {
        when(repository.findByAccountNumber("INVALID")).thenReturn(null);

        Account result = accountService.getUserByAccountNumber("INVALID");

        assertThat(result).isNull();
    }

    // ─── debit ────────────────────────────────────────────────────────────────

    @Test
    void debit_accountNotFound_returnsFalse() {
        when(repository.findByAccountNumber("MISSING")).thenReturn(null);

        boolean result = accountService.debit("MISSING", new BigDecimal("100.00"), "Bearer token");

        assertThat(result).isFalse();
        verify(repository, never()).save(any());
    }

    @Test
    void debit_insufficientFunds_returnsFalse() {
        when(repository.findByAccountNumber("894012345678")).thenReturn(sampleAccount);

        boolean result = accountService.debit("894012345678", new BigDecimal("10000.00"), "Bearer token");

        assertThat(result).isFalse();
        verify(repository, never()).save(any());
    }

    @Test
    void debit_sufficientFunds_deductsBalanceAndReturnsTrue() {
        when(repository.findByAccountNumber("894012345678")).thenReturn(sampleAccount);
        when(repository.save(any(Account.class))).thenReturn(sampleAccount);

        UserResponse userResponse = new UserResponse();
        userResponse.setFullname("John Doe");
        userResponse.setEmail("john@example.com");

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(UserResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(userResponse, HttpStatus.OK));

        boolean result = accountService.debit("894012345678", new BigDecimal("500.00"), "Bearer token");

        assertThat(result).isTrue();

        ArgumentCaptor<Account> captor = ArgumentCaptor.forClass(Account.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getBalance()).isEqualByComparingTo(new BigDecimal("4500.00"));
    }

    @Test
    void debit_exactBalance_succeeds() {
        when(repository.findByAccountNumber("894012345678")).thenReturn(sampleAccount);
        when(repository.save(any(Account.class))).thenReturn(sampleAccount);

        UserResponse userResponse = new UserResponse();
        userResponse.setFullname("John Doe");
        userResponse.setEmail("john@example.com");

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(UserResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(userResponse, HttpStatus.OK));

        boolean result = accountService.debit("894012345678", new BigDecimal("5000.00"), "Bearer token");

        assertThat(result).isTrue();
    }

    // ─── credit ───────────────────────────────────────────────────────────────

    @Test
    void credit_accountNotFound_returnsFalse() {
        when(repository.findByAccountNumber("MISSING")).thenReturn(null);

        boolean result = accountService.credit("MISSING", new BigDecimal("100.00"), "Bearer token");

        assertThat(result).isFalse();
        verify(repository, never()).save(any());
    }

    @Test
    void credit_accountFound_addsAmountAndReturnsTrue() {
        when(repository.findByAccountNumber("894012345678")).thenReturn(sampleAccount);
        when(repository.save(any(Account.class))).thenReturn(sampleAccount);

        UserResponse userResponse = new UserResponse();
        userResponse.setFullname("John Doe");
        userResponse.setEmail("john@example.com");

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(UserResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(userResponse, HttpStatus.OK));

        boolean result = accountService.credit("894012345678", new BigDecimal("1000.00"), "Bearer token");

        assertThat(result).isTrue();

        ArgumentCaptor<Account> captor = ArgumentCaptor.forClass(Account.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getBalance()).isEqualByComparingTo(new BigDecimal("6000.00"));
    }

    // ─── getBalanceByAccountNumber ────────────────────────────────────────────

    @Test
    void getBalanceByAccountNumber_returnsCorrectBalance() {
        when(repository.findByAccountNumber("894012345678")).thenReturn(sampleAccount);

        BigDecimal balance = accountService.getBalanceByAccountNumber("894012345678");

        assertThat(balance).isEqualByComparingTo(new BigDecimal("5000.00"));
    }

    // ─── creditAmount ─────────────────────────────────────────────────────────

    @Test
    void creditAmount_addsToExistingBalance() {
        when(repository.findByAccountNumber("894012345678")).thenReturn(sampleAccount);
        when(repository.save(any(Account.class))).thenReturn(sampleAccount);

        accountService.creditAmount("894012345678", new BigDecimal("250.00"));

        ArgumentCaptor<Account> captor = ArgumentCaptor.forClass(Account.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getBalance()).isEqualByComparingTo(new BigDecimal("5250.00"));
    }
}
