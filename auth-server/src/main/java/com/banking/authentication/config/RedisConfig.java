package com.banking.authentication.config;

import org.springframework.context.annotation.Bean;
        import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
@Configuration

public class RedisConfig {
@Bean
public RedisTemplate<String, Object> redisTemplate(
        RedisConnectionFactory factory) {

    RedisTemplate<String, Object> template =
            new RedisTemplate<>();

    template.setConnectionFactory(factory);
// Key as String
        template.setKeySerializer(
                new StringRedisSerializer()
        );

                // Value as JSON
                template.setValueSerializer(
                new GenericJackson2JsonRedisSerializer()
        );

                template.setHashKeySerializer(
                new StringRedisSerializer()
        );

                template.setHashValueSerializer(
                new GenericJackson2JsonRedisSerializer()
        );

                template.afterPropertiesSet();

        return template;
    }
            }