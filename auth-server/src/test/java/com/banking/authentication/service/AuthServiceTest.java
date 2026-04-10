package com.banking.authentication.service;

import com.banking.authentication.config.JwtUtil;
import com.banking.authentication.model.LoginRequest;
import com.banking.authentication.model.RegisterRequest;
import com.banking.authentication.model.User;
import com.banking.authentication.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository repo;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private KafkaProducerService kafkaProducerService;

    @Mock
    private RedisService redisService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        // redisService is @Autowired field-injected (not constructor-injected) in AuthService,
        // so Mockito cannot inject it automatically after constructor injection - do it manually.
        ReflectionTestUtils.setField(authService, "redisService", redisService);

        sampleUser = new User();
        sampleUser.setId(UUID.randomUUID());
        sampleUser.setUsername("john");
        sampleUser.setEmail("john@example.com");
        sampleUser.setPhone("9876543210");
        sampleUser.setPassword("$2a$10$encodedPassword");
        sampleUser.setRoles("USER");
    }

    // ─── login ────────────────────────────────────────────────────────────────

    @Test
    void login_userNotFound_throwsRuntimeException() {
        LoginRequest request = new LoginRequest("unknown", "password");
        when(repo.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void login_invalidPassword_throwsRuntimeException() {
        LoginRequest request = new LoginRequest("john", "wrongPass");
        when(repo.findByUsername("john")).thenReturn(Optional.of(sampleUser));
        when(encoder.matches("wrongPass", sampleUser.getPassword())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Invalid credentials");
    }

    @Test
    void login_validCredentials_returnsTokenAndRole() {
        LoginRequest request = new LoginRequest("john", "correctPass");
        when(repo.findByUsername("john")).thenReturn(Optional.of(sampleUser));
        when(encoder.matches("correctPass", sampleUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(anyMap(), eq("john"))).thenReturn("jwt-token");

        Map<String, String> result = authService.login(request);

        assertThat(result).containsEntry("token", "jwt-token");
        assertThat(result).containsEntry("role", "USER");
    }

    @Test
    void login_success_sendsLoginEmailViaKafka() {
        LoginRequest request = new LoginRequest("john", "correctPass");
        when(repo.findByUsername("john")).thenReturn(Optional.of(sampleUser));
        when(encoder.matches("correctPass", sampleUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(anyMap(), eq("john"))).thenReturn("jwt-token");

        authService.login(request);

        verify(kafkaProducerService).sendLoginSuccess(eq("banking-users"), anyString());
    }

    @Test
    void login_tokenContainsUsernameAndRoleClaims() {
        LoginRequest request = new LoginRequest("john", "correctPass");
        when(repo.findByUsername("john")).thenReturn(Optional.of(sampleUser));
        when(encoder.matches("correctPass", sampleUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(anyMap(), eq("john"))).thenReturn("jwt-token");

        authService.login(request);

        // Capture the claims map passed to generateToken
        var claimsCaptor = org.mockito.ArgumentCaptor.forClass(Map.class);
        verify(jwtUtil).generateToken(claimsCaptor.capture(), eq("john"));
        Map<String, Object> claims = claimsCaptor.getValue();
        assertThat(claims).containsEntry("username", "john");
        assertThat(claims).containsEntry("role", "USER");
    }

    // ─── sendOtp ──────────────────────────────────────────────────────────────

    @Test
    void sendOtp_storesOtpInRedis() {
        String result = authService.sendOtp("john@example.com");

        verify(redisService).set(eq("otp:john@example.com"), anyString(), eq(5L));
        assertThat(result).isEqualTo("OTP sent to phone");
    }

    @Test
    void sendOtp_sendsOtpEmailViaKafka() {
        authService.sendOtp("john@example.com");

        verify(kafkaProducerService).sendOtp(eq("banking-users"), anyString());
    }

    @Test
    void sendOtp_generatesNumericSixDigitOtp() {
        // Capture the value stored in redis and verify it is a 6-digit number
        var valueCaptor = org.mockito.ArgumentCaptor.forClass(String.class);
        authService.sendOtp("test@example.com");

        verify(redisService).set(eq("otp:test@example.com"), valueCaptor.capture(), anyLong());
        String otp = valueCaptor.getValue();
        assertThat(otp).matches("\\d{6}");
    }

    // ─── verifyOtp ────────────────────────────────────────────────────────────

    @Test
    void verifyOtp_otpExpired_throwsRuntimeException() {
        when(redisService.get("otp:john@example.com", String.class)).thenReturn(null);

        assertThatThrownBy(() -> authService.verifyOtp("john@example.com", "123456"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("OTP expired");
    }

    @Test
    void verifyOtp_wrongOtp_returnsFalse() throws Exception {
        when(redisService.get("otp:john@example.com", String.class)).thenReturn("654321");

        boolean result = authService.verifyOtp("john@example.com", "123456");

        assertThat(result).isFalse();
    }

    @Test
    void verifyOtp_registrationExpired_throwsRuntimeException() {
        when(redisService.get("otp:john@example.com", String.class)).thenReturn("123456");
        when(redisService.get("user:john@example.com", RegisterRequest.class)).thenReturn(null);

        assertThatThrownBy(() -> authService.verifyOtp("john@example.com", "123456"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Registration expired");
    }
}
