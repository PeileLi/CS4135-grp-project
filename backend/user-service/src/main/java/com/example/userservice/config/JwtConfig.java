package com.example.userservice.config;

import org.springframework.stereotype.Component;

@Component
public class JwtConfig {
    public String getSecret() {
        return "mySecretKeyForJWTTokenGenerationAndValidation2024";
    }

    public long getExpiration() {
        return 86400000;
    }

    public String getTokenPrefix() {
        return "Bearer ";
    }

    public String getHeaderString() {
        return "Authorization";
    }
}