package com.banking.loan.service;

import com.banking.loan.event.LoanApprovedEvent;
import com.banking.loan.model.*;
import com.banking.loan.repository.LoanRepository;
import com.banking.loan.response.AccountResponse;
import com.banking.loan.response.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanServiceImplTest {

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private KafkaProducerService kafkaProducerService;

    @Mock
    private LoanProducer loanProducer;

    @Mock
    private RedisService redisService;

    @InjectMocks
    private LoanServiceImpl loanService;

    private Loan sampleLoan;

    @BeforeEach
    void setUp() {
        sampleLoan = new Loan();
        sampleLoan.setId(1L);
        sampleLoan.setAccountNumber("ACC001");
        sampleLoan.setLoanType(LoanType.PERSONAL_LOAN);
        sampleLoan.setPrincipalAmount(new BigDecimal("100000.00"));
        sampleLoan.setInterestRate(10.0);
        sampleLoan.setTenureMonths(12);
        sampleLoan.setEmiAmount(new BigDecimal("8791.59"));
        sampleLoan.setStatus(LoanStatus.PENDING);
        sampleLoan.setCreatedAt(LocalDate.now());
        sampleLoan.setUpdatedAt(LocalDate.now());
    }

    // ─── getLoanById ──────────────────────────────────────────────────────────

    @Test
    void getLoanById_found_returnsDto() {
        when(loanRepository.findById(1L)).thenReturn(Optional.of(sampleLoan));

        LoanResponseDto dto = loanService.getLoanById(1L);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getAccountNumber()).isEqualTo("ACC001");
        assertThat(dto.getLoanType()).isEqualTo(LoanType.PERSONAL_LOAN);
        assertThat(dto.getStatus()).isEqualTo(LoanStatus.PENDING);
    }

    @Test
    void getLoanById_notFound_throwsException() {
        when(loanRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanService.getLoanById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Loan not found");
    }

    // ─── getLoansByAccountNumber ───────────────────────────────────────────────

    @Test
    void getLoansByAccountNumber_returnsAllLoansForAccount() {
        Loan second = new Loan();
        second.setId(2L);
        second.setAccountNumber("ACC001");
        second.setLoanType(LoanType.HOME_LOAN);
        second.setPrincipalAmount(new BigDecimal("500000.00"));
        second.setInterestRate(8.5);
        second.setTenureMonths(60);
        second.setEmiAmount(new BigDecimal("10243.00"));
        second.setStatus(LoanStatus.ACTIVE);

        when(loanRepository.findByAccountNumber("ACC001")).thenReturn(List.of(sampleLoan, second));

        List<LoanResponseDto> loans = loanService.getLoansByAccountNumber("ACC001");

        assertThat(loans).hasSize(2);
        assertThat(loans).extracting(LoanResponseDto::getAccountNumber).containsOnly("ACC001");
    }

    @Test
    void getLoansByAccountNumber_noLoans_returnsEmptyList() {
        when(loanRepository.findByAccountNumber("EMPTY")).thenReturn(List.of());

        List<LoanResponseDto> loans = loanService.getLoansByAccountNumber("EMPTY");

        assertThat(loans).isEmpty();
    }

    // ─── approveLoan ──────────────────────────────────────────────────────────

    @Test
    void approveLoan_setsStatusApprovedAndDates() {
        when(loanRepository.findById(1L)).thenReturn(Optional.of(sampleLoan));
        when(loanRepository.save(any(Loan.class))).thenReturn(sampleLoan);

        LoanResponseDto dto = loanService.approveLoan(1L);

        ArgumentCaptor<Loan> captor = ArgumentCaptor.forClass(Loan.class);
        verify(loanRepository).save(captor.capture());
        Loan saved = captor.getValue();

        assertThat(saved.getStatus()).isEqualTo(LoanStatus.APPROVED);
        assertThat(saved.getStartDate()).isEqualTo(LocalDate.now());
        assertThat(saved.getEndDate()).isEqualTo(LocalDate.now().plusMonths(12));
    }

    @Test
    void approveLoan_publishesLoanApprovedEvent() {
        when(loanRepository.findById(1L)).thenReturn(Optional.of(sampleLoan));
        when(loanRepository.save(any(Loan.class))).thenReturn(sampleLoan);

        loanService.approveLoan(1L);

        ArgumentCaptor<LoanApprovedEvent> eventCaptor = ArgumentCaptor.forClass(LoanApprovedEvent.class);
        verify(loanProducer).sendLoanApprovedEvent(eventCaptor.capture());
        LoanApprovedEvent event = eventCaptor.getValue();

        assertThat(event.getLoanId()).isEqualTo(1L);
        assertThat(event.getAccountNumber()).isEqualTo("ACC001");
        assertThat(event.getAmount()).isEqualByComparingTo(new BigDecimal("100000.00"));
    }

    @Test
    void approveLoan_notFound_throwsException() {
        when(loanRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanService.approveLoan(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Loan not found");
    }

    // ─── rejectLoan ───────────────────────────────────────────────────────────

    @Test
    void rejectLoan_setsStatusRejected() {
        when(loanRepository.findById(1L)).thenReturn(Optional.of(sampleLoan));
        when(loanRepository.save(any(Loan.class))).thenReturn(sampleLoan);

        LoanResponseDto dto = loanService.rejectLoan(1L);

        ArgumentCaptor<Loan> captor = ArgumentCaptor.forClass(Loan.class);
        verify(loanRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(LoanStatus.REJECTED);
    }

    @Test
    void rejectLoan_notFound_throwsException() {
        when(loanRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanService.rejectLoan(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Loan not found");
    }

    // ─── makeRepayment ────────────────────────────────────────────────────────

    @Test
    void makeRepayment_partialRepayment_setsStatusActive() {
        // principal > emi, so remaining > 0 → ACTIVE
        sampleLoan.setPrincipalAmount(new BigDecimal("100000.00"));
        sampleLoan.setEmiAmount(new BigDecimal("8791.59"));

        UserResponse user = new UserResponse();
        user.setUsername("john");
        user.setEmail("john@example.com");

        when(loanRepository.findById(1L)).thenReturn(Optional.of(sampleLoan));
        when(loanRepository.save(any(Loan.class))).thenReturn(sampleLoan);
        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(UserResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(user, HttpStatus.OK));

        LoanResponseDto dto = loanService.makeRepayment(1L, "john", "Bearer token");

        ArgumentCaptor<Loan> captor = ArgumentCaptor.forClass(Loan.class);
        verify(loanRepository).save(captor.capture());
        Loan saved = captor.getValue();

        assertThat(saved.getStatus()).isEqualTo(LoanStatus.ACTIVE);
        assertThat(saved.getPrincipalAmount()).isEqualByComparingTo(new BigDecimal("91208.41"));
    }

    @Test
    void makeRepayment_fullRepayment_setsStatusClosed() {
        // emi equals principal → remaining = 0 → CLOSED
        sampleLoan.setPrincipalAmount(new BigDecimal("8791.59"));
        sampleLoan.setEmiAmount(new BigDecimal("8791.59"));

        UserResponse user = new UserResponse();
        user.setUsername("john");
        user.setEmail("john@example.com");

        when(loanRepository.findById(1L)).thenReturn(Optional.of(sampleLoan));
        when(loanRepository.save(any(Loan.class))).thenReturn(sampleLoan);
        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(UserResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(user, HttpStatus.OK));

        loanService.makeRepayment(1L, "john", "Bearer token");

        ArgumentCaptor<Loan> captor = ArgumentCaptor.forClass(Loan.class);
        verify(loanRepository).save(captor.capture());
        Loan saved = captor.getValue();

        assertThat(saved.getStatus()).isEqualTo(LoanStatus.CLOSED);
        assertThat(saved.getPrincipalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void makeRepayment_overpayment_doesNotGoNegative() {
        // emi > principal → clamped to 0 → CLOSED
        sampleLoan.setPrincipalAmount(new BigDecimal("100.00"));
        sampleLoan.setEmiAmount(new BigDecimal("500.00"));

        UserResponse user = new UserResponse();
        user.setUsername("john");
        user.setEmail("john@example.com");

        when(loanRepository.findById(1L)).thenReturn(Optional.of(sampleLoan));
        when(loanRepository.save(any(Loan.class))).thenReturn(sampleLoan);
        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(UserResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(user, HttpStatus.OK));

        loanService.makeRepayment(1L, "john", "Bearer token");

        ArgumentCaptor<Loan> captor = ArgumentCaptor.forClass(Loan.class);
        verify(loanRepository).save(captor.capture());
        Loan saved = captor.getValue();

        assertThat(saved.getPrincipalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(saved.getStatus()).isEqualTo(LoanStatus.CLOSED);
    }

    @Test
    void makeRepayment_loanNotFound_throwsException() {
        when(loanRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> loanService.makeRepayment(99L, "john", "Bearer token"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Loan not found");
    }

    @Test
    void makeRepayment_userServiceFails_throwsException() {
        sampleLoan.setPrincipalAmount(new BigDecimal("100000.00"));
        sampleLoan.setEmiAmount(new BigDecimal("8791.59"));

        when(loanRepository.findById(1L)).thenReturn(Optional.of(sampleLoan));
        when(loanRepository.save(any(Loan.class))).thenReturn(sampleLoan);
        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(UserResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(null, HttpStatus.OK));

        assertThatThrownBy(() -> loanService.makeRepayment(1L, "john", "Bearer token"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User service validation failed");
    }

    // ─── getPendingLoans / getActiveLoans ─────────────────────────────────────

    @Test
    void getPendingLoans_returnsPendingLoans() {
        when(loanRepository.findByStatus(LoanStatus.PENDING)).thenReturn(List.of(sampleLoan));

        List<Loan> pending = loanService.getPendingLoans();

        assertThat(pending).hasSize(1);
        assertThat(pending.get(0).getStatus()).isEqualTo(LoanStatus.PENDING);
    }

    @Test
    void getActiveLoans_returnsApprovedLoans() {
        sampleLoan.setStatus(LoanStatus.APPROVED);
        when(loanRepository.findByStatus(LoanStatus.APPROVED)).thenReturn(List.of(sampleLoan));

        List<Loan> active = loanService.getActiveLoans();

        assertThat(active).hasSize(1);
        assertThat(active.get(0).getStatus()).isEqualTo(LoanStatus.APPROVED);
    }

    // ─── applyLoan ────────────────────────────────────────────────────────────

    @Test
    void applyLoan_ownershipMismatch_throwsAccessDeniedException() {
        LoanRequestDto req = new LoanRequestDto();
        req.setAccountNumber("ACC001");
        req.setLoanType(LoanType.PERSONAL_LOAN);
        req.setPrincipalAmount(new BigDecimal("50000.00"));
        req.setInterestRate(10.0);
        req.setTenureMonths(12);

        AccountResponse accountResponse = new AccountResponse();
        accountResponse.setAccountNumber("ACC001");
        accountResponse.setUsername("otherUser"); // different owner

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(AccountResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(accountResponse, HttpStatus.OK));

        assertThatThrownBy(() -> loanService.applyLoan(req, "john", "Bearer token"))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("cannot apply loan for another user");
    }

    @Test
    void applyLoan_accountServiceFails_throwsException() {
        LoanRequestDto req = new LoanRequestDto();
        req.setAccountNumber("ACC001");
        req.setLoanType(LoanType.PERSONAL_LOAN);
        req.setPrincipalAmount(new BigDecimal("50000.00"));
        req.setInterestRate(10.0);
        req.setTenureMonths(12);

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(AccountResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(null, HttpStatus.OK));

        assertThatThrownBy(() -> loanService.applyLoan(req, "john", "Bearer token"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Account service validation failed");
    }

    @Test
    void applyLoan_success_savesLoanWithPendingStatus() throws AccessDeniedException {
        LoanRequestDto req = new LoanRequestDto();
        req.setAccountNumber("ACC001");
        req.setLoanType(LoanType.PERSONAL_LOAN);
        req.setPrincipalAmount(new BigDecimal("50000.00"));
        req.setInterestRate(12.0);
        req.setTenureMonths(12);

        AccountResponse accountResponse = new AccountResponse();
        accountResponse.setAccountNumber("ACC001");
        accountResponse.setUsername("john");

        when(restTemplate.exchange(
                anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(AccountResponse.class), anyString()))
                .thenReturn(new ResponseEntity<>(accountResponse, HttpStatus.OK));
        when(loanRepository.save(any(Loan.class))).thenReturn(sampleLoan);
        when(loanRepository.findEmailByAccountNumber("ACC001")).thenReturn("john@example.com");

        LoanResponseDto dto = loanService.applyLoan(req, "john", "Bearer token");

        ArgumentCaptor<Loan> captor = ArgumentCaptor.forClass(Loan.class);
        verify(loanRepository).save(captor.capture());
        Loan saved = captor.getValue();

        assertThat(saved.getStatus()).isEqualTo(LoanStatus.PENDING);
        assertThat(saved.getAccountNumber()).isEqualTo("ACC001");
        assertThat(saved.getLoanType()).isEqualTo(LoanType.PERSONAL_LOAN);
        // EMI should be calculated (non-zero)
        assertThat(saved.getEmiAmount()).isGreaterThan(BigDecimal.ZERO);
    }
}
