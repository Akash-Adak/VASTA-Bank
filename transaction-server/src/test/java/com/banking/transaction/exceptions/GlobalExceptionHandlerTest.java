package com.banking.transaction.exceptions;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler handler;

    @Test
    void handleIllegalArgument_returnsBadRequest() {
        IllegalArgumentException ex = new IllegalArgumentException("bad argument");

        ResponseEntity<ApiError> response = handler.handleIllegalArgument(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("bad argument");
        assertThat(response.getBody().getStatus()).isEqualTo(400);
    }

    @Test
    void handleIllegalState_returnsConflict() {
        IllegalStateException ex = new IllegalStateException("state conflict");

        ResponseEntity<ApiError> response = handler.handleIllegalState(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("state conflict");
        assertThat(response.getBody().getStatus()).isEqualTo(409);
    }

    @Test
    void handleSecurity_returnsUnauthorized() {
        SecurityException ex = new SecurityException("access denied");

        ResponseEntity<ApiError> response = handler.handleSecurity(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("access denied");
        assertThat(response.getBody().getStatus()).isEqualTo(401);
    }

    @Test
    void handleValidation_returnsBadRequestWithFieldErrors() {
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError = new FieldError("obj", "amount", "must be positive");

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        ResponseEntity<ApiError> response = handler.handleValidation(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Validation failed");
        @SuppressWarnings("unchecked")
        Map<String, String> details = (Map<String, String>) response.getBody().getDetails();
        assertThat(details).containsEntry("amount", "must be positive");
    }

    @Test
    void handleNotReadable_returnsBadRequest() {
        HttpMessageNotReadableException ex = mock(HttpMessageNotReadableException.class);

        ResponseEntity<ApiError> response = handler.handleNotReadable(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Malformed JSON request");
    }

    @Test
    void handleAny_returnsInternalServerError() {
        Exception ex = new Exception("unexpected");

        ResponseEntity<ApiError> response = handler.handleAny(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Unexpected error");
        assertThat(response.getBody().getStatus()).isEqualTo(500);
    }

    @Test
    void apiError_gettersReturnCorrectValues() {
        ApiError error = new ApiError("2024-01-01T00:00:00Z", 400, "test message", "details");

        assertThat(error.getTimestamp()).isEqualTo("2024-01-01T00:00:00Z");
        assertThat(error.getStatus()).isEqualTo(400);
        assertThat(error.getMessage()).isEqualTo("test message");
        assertThat(error.getDetails()).isEqualTo("details");
    }
}
