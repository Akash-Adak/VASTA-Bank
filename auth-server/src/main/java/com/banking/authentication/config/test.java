package com.banking.authentication.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class test {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @PostConstruct
    public void testRedis() {
        try {
            redisTemplate.opsForValue().set("ping", "pong", Duration.ofSeconds(10));
            String value = (String) redisTemplate.opsForValue().get("ping");
            System.out.println("✅ Redis connected: ping = " + value);
        } catch (Exception e) {
            System.err.println("❌ Redis test failed:");
            e.printStackTrace();
        }
    }
}
