package com.example.orderservice.controller;

import com.example.orderservice.model.Discount;
import com.example.orderservice.service.DiscountCreateRequest;
import com.example.orderservice.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
public class DiscountController {

    private final DiscountService discountService;

    @PostMapping
    public ResponseEntity<Discount> createDiscount(@RequestBody DiscountCreateRequest request) {
        return ResponseEntity.ok(discountService.createDiscount(request));
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateDiscount(
            @RequestParam String code,
            @RequestParam BigDecimal orderAmount) {
        return ResponseEntity.ok(discountService.validateDiscount(code, orderAmount));
    }

    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyDiscount(
            @RequestParam String code,
            @RequestParam BigDecimal orderAmount) {
        return ResponseEntity.ok(discountService.applyDiscount(code, orderAmount));
    }

    @GetMapping
    public ResponseEntity<List<Discount>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.ok().build();
    }
}