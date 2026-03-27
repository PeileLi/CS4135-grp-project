package com.example.paymentservice.service;

import com.example.paymentservice.model.Payment;
import com.example.paymentservice.model.PaymentStatus;
import com.example.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @Transactional
    public Payment createPayment(PaymentRequest request) {
        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .status(PaymentStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .build();

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment processPayment(Long paymentId, PaymentProcessRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Payment already processed");
        }

        try {
            String transactionId = processWithGateway(payment, request);

            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaymentMethod(request.getPaymentMethod());

        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }

        return paymentRepository.save(payment);
    }

    private String processWithGateway(Payment payment, PaymentProcessRequest request) {
        validatePaymentInfo(request);
        return "TXN_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }

    private void validatePaymentInfo(PaymentProcessRequest request) {
        String method = request.getPaymentMethod();

        switch (method.toLowerCase()) {
            case "credit_card":
                if (request.getCardNumber() == null || request.getCardNumber().length() != 16) {
                    throw new RuntimeException("Invalid card number");
                }
                if (request.getExpiryDate() == null || request.getCvv() == null) {
                    throw new RuntimeException("Missing card details");
                }
                break;

            case "debit_card":
                if (request.getCardNumber() == null || request.getCardNumber().length() != 16) {
                    throw new RuntimeException("Invalid card number");
                }
                break;

            case "paypal":
                if (request.getPaypalEmail() == null) {
                    throw new RuntimeException("PayPal email required");
                }
                break;

            case "wallet":
                break;

            default:
                throw new RuntimeException("Unsupported payment method: " + method);
        }
    }

    public Payment getPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public Payment getPaymentByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order"));
    }

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Transactional
    public Payment refundPayment(Long paymentId, BigDecimal amount) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new RuntimeException("Only successful payments can be refunded");
        }

        BigDecimal refundAmount = amount != null ? amount : payment.getAmount();

        if (refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new RuntimeException("Refund amount exceeds payment amount");
        }

        try {
            payment.setStatus(PaymentStatus.REFUNDED);
        } catch (Exception e) {
            throw new RuntimeException("Refund failed: " + e.getMessage());
        }

        return paymentRepository.save(payment);
    }

    public List<String> getSupportedPaymentMethods() {
        return List.of("credit_card", "debit_card", "paypal", "wallet");
    }
}