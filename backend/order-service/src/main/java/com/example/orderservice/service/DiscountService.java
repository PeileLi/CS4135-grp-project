package com.example.orderservice.service;

import com.example.orderservice.model.Discount;
import com.example.orderservice.model.DiscountType;
import com.example.orderservice.repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRepository discountRepository;

    @Transactional
    public Discount createDiscount(DiscountCreateRequest request) {
        if (discountRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Discount code already exists");
        }

        Discount discount = Discount.builder()
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .type(request.getType())
                .value(request.getValue())
                .minimumOrderAmount(request.getMinimumOrderAmount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit())
                .build();

        return discountRepository.save(discount);
    }

    public Map<String, Object> validateDiscount(String code, BigDecimal orderAmount) {
        Discount discount = discountRepository.findByCodeAndActiveTrue(code.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Invalid discount code"));

        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("discount", discount);
        result.put("discountAmount", calculateDiscountAmount(discount, orderAmount));

        return result;
    }

    @Transactional
    public Map<String, Object> applyDiscount(String code, BigDecimal orderAmount) {
        Discount discount = discountRepository.findByCodeAndActiveTrue(code.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Invalid discount code"));

        LocalDateTime now = LocalDateTime.now();
        if (discount.getStartDate() != null && now.isBefore(discount.getStartDate())) {
            throw new RuntimeException("Discount not yet valid");
        }
        if (discount.getEndDate() != null && now.isAfter(discount.getEndDate())) {
            throw new RuntimeException("Discount has expired");
        }

        if (discount.getUsageLimit() != null && discount.getUsedCount() >= discount.getUsageLimit()) {
            throw new RuntimeException("Discount usage limit exceeded");
        }

        if (discount.getMinimumOrderAmount() != null &&
                orderAmount.compareTo(discount.getMinimumOrderAmount()) < 0) {
            throw new RuntimeException("Order amount does not meet minimum requirement");
        }

        BigDecimal discountAmount = calculateDiscountAmount(discount, orderAmount);
        BigDecimal finalAmount = orderAmount.subtract(discountAmount);

        discount.setUsedCount(discount.getUsedCount() + 1);
        discountRepository.save(discount);

        Map<String, Object> result = new HashMap<>();
        result.put("originalAmount", orderAmount);
        result.put("discountAmount", discountAmount);
        result.put("finalAmount", finalAmount);
        result.put("discountCode", discount.getCode());

        return result;
    }

    private BigDecimal calculateDiscountAmount(Discount discount, BigDecimal orderAmount) {
        if (discount.getType() == DiscountType.PERCENTAGE) {
            return orderAmount.multiply(discount.getValue())
                    .divide(BigDecimal.valueOf(100));
        } else {
            return discount.getValue();
        }
    }

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    @Transactional
    public void deleteDiscount(Long id) {
        discountRepository.deleteById(id);
    }
}