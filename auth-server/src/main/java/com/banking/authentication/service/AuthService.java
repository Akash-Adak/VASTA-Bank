package com.banking.authentication.service;

import com.banking.authentication.Exception.RunTimeException;
import com.banking.authentication.config.JwtUtil;
import com.banking.authentication.model.LoginRequest;
import com.banking.authentication.model.RegisterRequest;
import com.banking.authentication.model.User;
import com.banking.authentication.model.Userdto;
import com.banking.authentication.repository.UserRepository;
import com.banking.authentication.response.RegisterRequestResponse;
import com.banking.authentication.response.UserResponse;
import com.banking.authentication.response.OtpResponse;
import com.google.gson.Gson;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

import java.util.Map;

@Service

public class AuthService {

    @Autowired
    private RedisService redisService;
    private final  UserRepository repo;

    private final PasswordEncoder encoder;

    private final JwtUtil jwtUtil;

    private final RestTemplate restTemplate;

    private final KafkaProducerService kafkaProducerService;

    public AuthService(UserRepository repo, PasswordEncoder encoder, JwtUtil jwtUtil, RestTemplate restTemplate, KafkaProducerService kafkaProducerService) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
        this.kafkaProducerService = kafkaProducerService;
    }

    public String register(RegisterRequest request) throws Exception {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRoles(request.getRole() != null ? request.getRole() : "USER");

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("role", user.getRoles());

        String token = jwtUtil.generateToken(claims, user.getUsername());
        if(user.getRoles()=="USER") {


            // ✅ FIX: Add JSON content type
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + token);

            Userdto dto = new Userdto(user.getUsername(), user.getPhone(), user.getEmail());
            HttpEntity<Userdto> entity = new HttpEntity<>(dto, headers);

            // ✅ Ensure RestTemplate bean is properly configured
            ResponseEntity<UserResponse> response = restTemplate.exchange(
                    "http://USER/api/users/create-user",
                    HttpMethod.POST,
                    entity,
                    UserResponse.class
            );


            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RunTimeException("Failed to create user in user-service");
            }
        }
        repo.save(user);

        RegisterRequestResponse event = new RegisterRequestResponse();
        String username = request.getUsername();
        String userEmail = request.getEmail();

// Email subject
        String subject = "Welcome to VASTA, " + username + "!";

// HTML Email body
        String body = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to VASTA Bank</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #0f3cc9;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
    }
    .content {
      padding: 25px;
      color: #333333;
      line-height: 1.6;
      font-size: 15px;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #0f3cc9;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #888888;
      background-color: #f1f1f1;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to VASTA Bank 🎉</h1>
      <p>Secure • Trusted • Digital Banking</p>
    </div>

    <div class="content">
      <p>Hello <strong>%s</strong>,</p>

      <p>
        Congratulations! Your registration with
        <strong>VASTA Bank</strong> has been completed successfully.
      </p>

      <p>
        You can now log in to your account and enjoy seamless, secure
        banking services from anywhere.
      </p>

      <a href="http://vasta-bank.vercel.app" class="button">
        Go to Your Dashboard
      </a>

      <p style="margin-top: 20px;">
        If you did not create this account, please contact our support team immediately.
      </p>
    </div>

    <div class="footer">
      © 2025 VASTA Bank. All rights reserved.
    </div>
  </div>
</body>
</html>
""".formatted(username);


// Set email event
        event.setUsername(subject); // Subject
        event.setEmail(userEmail);  // Recipient email
        event.setBody(body);        // HTML email body


        String json = new Gson().toJson(event);
        kafkaProducerService.sendUserRegistered("banking-users", json);

        return token;
    }


    public Map<String, String> login(LoginRequest request) {

        // 1️⃣ Find user
        var user = repo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2️⃣ Validate password
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3️⃣ JWT claims
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("role", user.getRoles()); // ADMIN / USER

        // 4️⃣ Generate JWT
        String token = jwtUtil.generateToken(claims, user.getUsername());

        // 5️⃣ Prepare RESPONSE (THIS WAS MISSING)
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRoles());


        // 6️⃣ Send login success email via Kafka
        sendLoginSuccessMail(user);

        return response; // ✅ NOW FRONTEND RECEIVES DATA
    }
    private void sendLoginSuccessMail(User user) {

        String subject = "Login Successful – Welcome Back to VASTA Bank";

        String body = """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f6f8;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: #0f3cc9;
              color: #ffffff;
              text-align: center;
              padding: 20px;
            }
            .content {
              padding: 25px;
              color: #333;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background: #0f3cc9;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #888;
              background: #f1f1f1;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>VASTA Bank</h1>
              <p>Secure • Reliable • Digital</p>
            </div>

            <div class="content">
              <p>Hello <strong>%s</strong>,</p>
              <p>Your login to <strong>VASTA Bank</strong> was successful.</p>
              <p>If this was you, no action is needed.</p>
              <p>If you do not recognize this activity, please reset your password immediately.</p>

              <a href="http://vasta-bank.vercel.app" class="button">
                Go to Dashboard
              </a>
            </div>

            <div class="footer">
              © 2025 VASTA Bank. All rights reserved.
            </div>
          </div>
        </body>
        </html>
        """.formatted(user.getUsername());

        RegisterRequestResponse event = new RegisterRequestResponse();
        event.setUsername(subject);
        event.setEmail(user.getEmail());
        event.setBody(body);
        event.setContentType("text/html");

        String json = new Gson().toJson(event);
        kafkaProducerService.sendLoginSuccess("banking-users", json);
    }

    public String sendOtp(String email) {
        // Generate OTP
        String otp = String.valueOf(
                (int)(Math.random() * 900000) + 100000
        );
        String key="otp:"+email;
    redisService.set(key, otp, 5); // Store OTP in Redis with 5 minutes expiration

        RegisterRequestResponse event = new RegisterRequestResponse();
        String userEmail = email;

        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <style>" +
                "    body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }" +
                "    .container { background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }" +
                "    h2 { color: #2c3e50; }" +
                "    .otp { font-size: 24px; font-weight: bold; color: #e74c3c; margin: 20px 0; }" +
                "    p { color: #555555; }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <h2>VASTA Bank - OTP Verification</h2>" +
                "    <p>Dear " + email + ",</p>" +
                "    <p>Use the following One-Time Password (OTP) to complete your verification process:</p>" +
                "    <div class='otp'>" + otp + "</div>" +
                "    <p>This OTP is valid for <strong>2 minutes</strong>. Please do not share it with anyone.</p>" +
                "    <p>If you did not request this, please ignore this email.</p>" +
                "    <br>" +
                "    <p>Best regards,<br>VASTA Bank Security Team</p>" +
                "  </div>" +
                "</body>" +
                "</html>";


        event.setEmail(userEmail);  // Recipient email
        event.setUsername("Your OTP Code"); // Subject
        event.setBody(body);        // HTML email body


        String json = new Gson().toJson(event);
        kafkaProducerService.sendOtp("banking-users", json);
        return "OTP sent to phone";
    }

    public boolean verifyOtp(String email, String otp) throws Exception {
        String key="otp:"+email;
        String storedOtp = (String)redisService.get(key,String.class);

        if(storedOtp == null)
            throw new RuntimeException("OTP expired");

        if(!storedOtp.equals(otp))
            return false;

        // Fetch stored registration data
        RegisterRequest request = (RegisterRequest) redisService.get("user:" + email, RegisterRequest.class);

        if(request == null)
            throw new RuntimeException("Registration expired");

        // Save to DB
        String s=register(request);

         User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found after registration"));

        // Delete Redis keys
        redisService.delete("otp:" + email);
        redisService.delete("user:" + email);

        return true;
    }

}

