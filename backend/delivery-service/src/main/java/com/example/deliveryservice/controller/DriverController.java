package com.example.deliveryservice.controller;

import com.example.deliveryservice.model.Driver;
import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.service.DriverService;
import com.example.deliveryservice.service.DriverRegistrationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<Driver> registerDriver(@RequestBody DriverRegistrationRequest request) {
        return ResponseEntity.ok(driverService.registerDriver(request));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }

    @GetMapping("/{driverId}")
    public ResponseEntity<Driver> getDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(driverService.getDriver(driverId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Driver> getDriverByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(driverService.getDriverByUserId(userId));
    }

    @PatchMapping("/{driverId}/status")
    public ResponseEntity<Driver> updateDriverStatus(
            @PathVariable Long driverId,
            @RequestParam boolean available) {
        return ResponseEntity.ok(driverService.updateDriverStatus(driverId, available));
    }

    @PostMapping("/{driverId}/accept-delivery/{deliveryId}")
    public ResponseEntity<Delivery> acceptDelivery(
            @PathVariable Long driverId,
            @PathVariable Long deliveryId) {
        return ResponseEntity.ok(driverService.acceptDelivery(driverId, deliveryId));
    }

    @PatchMapping("/delivery/{deliveryId}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(
            @PathVariable Long deliveryId,
            @RequestParam String status) {
        return ResponseEntity.ok(driverService.updateDeliveryStatus(deliveryId, status));
    }

    @GetMapping("/{driverId}/deliveries")
    public ResponseEntity<List<Delivery>> getDriverDeliveries(@PathVariable Long driverId) {
        return ResponseEntity.ok(driverService.getDriverDeliveries(driverId));
    }

    @GetMapping("/{driverId}/current-delivery")
    public ResponseEntity<Delivery> getCurrentDelivery(@PathVariable Long driverId) {
        return ResponseEntity.ok(driverService.getCurrentDelivery(driverId));
    }

    @GetMapping("/{driverId}/earnings")
    public ResponseEntity<Map<String, Object>> getDriverEarnings(@PathVariable Long driverId) {
        return ResponseEntity.ok(driverService.getDriverEarnings(driverId));
    }
}