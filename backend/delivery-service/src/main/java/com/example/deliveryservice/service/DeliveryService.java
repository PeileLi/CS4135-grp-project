package com.example.deliveryservice.service;

import com.example.deliveryservice.exception.InvalidOperationException;
import com.example.deliveryservice.exception.ResourceNotFoundException;
import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.model.DeliveryStatus;
import com.example.deliveryservice.model.Driver;
import com.example.deliveryservice.repository.DeliveryRepository;
import com.example.deliveryservice.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public List<Delivery> getAvailableDeliveries() {
        return deliveryRepository.findByStatus(DeliveryStatus.PENDING);
    }

    public Delivery getDelivery(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));
    }

    public Delivery getDeliveryByOrderId(Long orderId) {
        return deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found for order: " + orderId));
    }

    @Transactional
    public Delivery updateStatus(Long id, DeliveryStatus status) {
        Delivery delivery = getDelivery(id);
        delivery.setStatus(status);

        if (status == DeliveryStatus.DELIVERED && delivery.getDriver() != null) {
            Driver driver = delivery.getDriver();
            driver.setAvailable(true);
            driverRepository.save(driver);
        }

        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery assignDriver(Long deliveryId, Long driverId) {
        Delivery delivery = getDelivery(deliveryId);
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        if (!driver.isAvailable()) {
            throw new InvalidOperationException("Driver is not available");
        }

        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new InvalidOperationException("Delivery is not available for assignment");
        }

        delivery.setDriver(driver);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        driver.setAvailable(false);

        driverRepository.save(driver);
        return deliveryRepository.save(delivery);
    }

    public Delivery getDeliveryByOrder(Long orderId) {
        return getDeliveryByOrderId(orderId);
    }
}