package com.example.paymentservice.service;

import com.example.common.dto.PaymentEvent;
import com.example.paymentservice.exception.InvalidOperationException;
import com.example.paymentservice.exception.ResourceNotFoundException;
import com.example.paymentservice.messaging.PaymentEventPublisher;
import com.example.paymentservice.model.Payment;
import com.example.paymentservice.model.PaymentStatus;
import com.example.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final String PAYMENT_NOT_FOUND = "Payment not found";

    private final PaymentRepository paymentRepository;
    private final PaymentEventPublisher paymentEventPublisher;

    @Transactional
    public Payment createPayment(PaymentRequest request) {
        Optional<Payment> existing = paymentRepository
                .findFirstByOrderIdOrderByIdDesc(request.getOrderId());

        if (existing.isPresent()) {
            Payment p = existing.get();
            if (p.getStatus() == PaymentStatus.FAILED) {
                p.setStatus(PaymentStatus.PENDING);
                p.setAmount(request.getAmount());
                p.setPaymentMethod(request.getPaymentMethod());
                return paymentRepository.save(p);
            }
            return p;
        }

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
                .orElseThrow(() -> new ResourceNotFoundException(PAYMENT_NOT_FOUND));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return payment;
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentMethod(request.getPaymentMethod());

        Payment saved = paymentRepository.save(payment);

        PaymentEvent event = PaymentEvent.builder()
                .paymentId(saved.getId())
                .orderId(saved.getOrderId())
                .userId(saved.getUserId())
                .amount(saved.getAmount())
                .status("SUCCESS")
                .timestamp(LocalDateTime.now())
                .build();
        paymentEventPublisher.publishPaymentCompleted(event);

        return saved;
    }

    public Payment getPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException(PAYMENT_NOT_FOUND));
    }

    public Payment getPaymentByOrder(Long orderId) {
        return paymentRepository.findFirstByOrderIdOrderByIdDesc(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order"));
    }

    public List<Payment> getUserPayments(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Transactional
    public Payment refundPayment(Long paymentId, BigDecimal amount) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException(PAYMENT_NOT_FOUND));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new InvalidOperationException("Only successful payments can be refunded");
        }

        BigDecimal refundAmount = amount != null ? amount : payment.getAmount();

        if (refundAmount.compareTo(payment.getAmount()) > 0) {
            throw new InvalidOperationException("Refund amount exceeds payment amount");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        return paymentRepository.save(payment);
    }

    public List<String> getSupportedPaymentMethods() {
        return List.of("credit_card", "debit_card", "paypal", "wallet");
    }
}
