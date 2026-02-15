package com.banking.authentication.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void set(String key, Object value, long ttlMinutes) {

        redisTemplate.opsForValue()
                .set(key, value, ttlMinutes, TimeUnit.MINUTES);
    }

    @SuppressWarnings("unchecked")
    public <T> T get(String key, Class<T> clazz) {

        Object value = redisTemplate.opsForValue().get(key);

        if (value == null) return null;

        return (T) value;
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }

    public boolean exists(String key) {
        return Boolean.TRUE.equals(
                redisTemplate.hasKey(key)
        );
    }
}
