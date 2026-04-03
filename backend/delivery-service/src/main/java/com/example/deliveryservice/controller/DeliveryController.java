package com.example.deliveryservice.controller;

import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.model.DeliveryStatus;
import com.example.deliveryservice.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping("/available")
    public ResponseEntity<List<Delivery>> getAvailableDeliveries() {
        return ResponseEntity.ok(deliveryService.getAvailableDeliveries());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Delivery> getDeliveryByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(deliveryService.getDeliveryByOrderId(orderId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Delivery> updateStatus(@PathVariable Long id,
                                                  @RequestParam DeliveryStatus status) {
        return ResponseEntity.ok(deliveryService.updateStatus(id, status));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Delivery> assignDriver(@PathVariable Long id,
                                                  @RequestParam Long driverId) {
        return ResponseEntity.ok(deliveryService.assignDriver(id, driverId));
    }
}
