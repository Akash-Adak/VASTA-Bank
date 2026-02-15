package com.banking.authentication.response;

import lombok.Data;

@Data
public class OtpResponse {
    private String email;
    private String otp;
    private String body;
}
