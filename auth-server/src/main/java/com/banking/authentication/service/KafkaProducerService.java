package com.banking.authentication.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendUserRegistered(String topic, String messageJson) {
        kafkaTemplate.send(topic, messageJson);
    }


    public void sendLoginSuccess(String topic, String json) {
        kafkaTemplate.send(topic,json);
    }
    public void sendOtp(String topic, String json) {
        kafkaTemplate.send(topic,json);
    }
}
