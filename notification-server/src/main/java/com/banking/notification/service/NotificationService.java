package com.banking.notification.service;

import com.banking.notification.model.*;
import com.google.gson.Gson;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private EmailService emailService;

    public void processUserRegistered(String message) throws MessagingException {
        UserRegisteredEvent event = new Gson().fromJson(message, UserRegisteredEvent.class);

        emailService.sendEmail(event.getEmail(),event.getUsername(),event.getBody());

    }

    public void processAccountCreated(String message) throws MessagingException {
        AccountCreatedEvent event = new Gson().fromJson(message, AccountCreatedEvent.class);
        emailService.sendEmail(event.getEmail(), event.getAccountNumber(),event.getBody());

    }

    public void processTransaction(String message) throws MessagingException {
        TransactionCompletedEvent event = new Gson().fromJson(message, TransactionCompletedEvent.class);
        emailService.sendEmail(event.getEmail(), String.valueOf(event.getAmount()),event.getBody());

    }

    public void processLoans(String message) throws MessagingException {
        LoansEvent event = new Gson().fromJson(message, LoansEvent.class);
        emailService.sendEmail(event.getEmail(), String.valueOf(event.getUsername()),event.getBody());

    }
}
