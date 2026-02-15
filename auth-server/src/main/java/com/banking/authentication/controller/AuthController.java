package com.banking.authentication.controller;


import com.banking.authentication.Exception.UserAlreadyExistsException;
import com.banking.authentication.model.LoginRequest;
import com.banking.authentication.model.RegisterRequest;
import com.banking.authentication.repository.UserRepository;

import com.banking.authentication.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {



    private final  AuthService authService;

    private final  UserRepository userRepository;

    public AuthController(AuthService authService,UserRepository userRepository) {
        this.authService=authService;
        this.userRepository=userRepository;
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) throws Exception{

        if(userRepository.findByUsername(request.getUsername()).isPresent() ||
                userRepository.findByEmail(request.getEmail()).isPresent()||
         userRepository.findByPhone(request.getPhone()).isPresent()){
            throw new UserAlreadyExistsException("User already exists with same username, email, or phone");
        }
          String  res=  authService.register(request);
          return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) throws Exception{

        Map<String,String> s =authService.login(request);

       if(s==null)
           return new ResponseEntity<>("User not found! register first",HttpStatus.NOT_FOUND);
       return new ResponseEntity<>(s,HttpStatus.OK);
    }

//@PostMapping("/otp")
//    public ResponseEntity<String> verifyOtp(@RequestParam String email,@RequestParam String otp) throws Exception{
//        boolean isValid=authService.verifyOtp(email,otp);
//        if(isValid)
//            return new ResponseEntity<>("OTP verified successfully",HttpStatus.OK);
//        else
//            return new ResponseEntity<>("Invalid OTP",HttpStatus.BAD_REQUEST);
//    }

}
