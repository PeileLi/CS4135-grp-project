package com.example.paymentservice.service;

import lombok.Data;

@Data
public class PaymentProcessRequest {
    private String paymentMethod;

    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private String cardHolderName;

    private String paypalEmail;

    private String walletId;
}