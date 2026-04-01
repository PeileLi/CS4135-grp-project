package com.example.deliveryservice.controller;

import com.example.deliveryservice.model.Delivery;
import com.example.deliveryservice.model.DeliveryStatus;
import com.example.deliveryservice.model.Driver;
import com.example.deliveryservice.service.DriverService;
import com.example.deliveryservice.service.DriverRegistrationRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DriverController.class)
class DriverControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DriverService driverService;

    @Autowired
    private ObjectMapper objectMapper;

    private Driver testDriver;
    private Delivery testDelivery;
    private DriverRegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        testDriver = Driver.builder()
                .id(1L)
                .userId(100L)
                .name("John Doe")
                .phone("1234567890")
                .vehicle("Toyota Camry")
                .available(true)
                .build();

        testDelivery = Delivery.builder()
                .id(1L)
                .orderId(200L)
                .userId(100L)
                .status(DeliveryStatus.PENDING)
                .build();

        registrationRequest = new DriverRegistrationRequest();
        registrationRequest.setUserId(100L);
        registrationRequest.setName("John Doe");
        registrationRequest.setPhone("1234567890");
        registrationRequest.setVehicle("Toyota Camry");
    }

    @Test
    void registerDriver_ShouldReturnCreatedDriver() throws Exception {
        when(driverService.registerDriver(any(DriverRegistrationRequest.class))).thenReturn(testDriver);

        mockMvc.perform(post("/api/drivers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void getAvailableDrivers_ShouldReturnList() throws Exception {
        when(driverService.getAvailableDrivers()).thenReturn(List.of(testDriver));

        mockMvc.perform(get("/api/drivers/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("John Doe"));
    }

    @Test
    void getDriver_ShouldReturnDriver() throws Exception {
        when(driverService.getDriver(1L)).thenReturn(testDriver);

        mockMvc.perform(get("/api/drivers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void getDriverByUserId_ShouldReturnDriver() throws Exception {
        when(driverService.getDriverByUserId(100L)).thenReturn(testDriver);

        mockMvc.perform(get("/api/drivers/user/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void updateDriverStatus_ShouldUpdate() throws Exception {
        Driver updatedDriver = Driver.builder()
                .id(1L)
                .userId(100L)
                .name("John Doe")
                .available(false)
                .build();
        when(driverService.updateDriverStatus(eq(1L), eq(false))).thenReturn(updatedDriver);

        mockMvc.perform(patch("/api/drivers/1/status")
                        .param("available", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false));
    }

    @Test
    void acceptDelivery_ShouldReturnAssignedDelivery() throws Exception {
        testDelivery.setStatus(DeliveryStatus.ASSIGNED);
        testDelivery.setDriver(testDriver);
        when(driverService.acceptDelivery(1L, 1L)).thenReturn(testDelivery);

        mockMvc.perform(post("/api/drivers/1/accept-delivery/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ASSIGNED"));
    }

    @Test
    void updateDeliveryStatus_ShouldUpdate() throws Exception {
        testDelivery.setStatus(DeliveryStatus.DELIVERED);
        when(driverService.updateDeliveryStatus(eq(1L), eq("DELIVERED"))).thenReturn(testDelivery);

        mockMvc.perform(patch("/api/drivers/delivery/1/status")
                        .param("status", "DELIVERED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELIVERED"));
    }

    @Test
    void getDriverDeliveries_ShouldReturnList() throws Exception {
        when(driverService.getDriverDeliveries(1L)).thenReturn(List.of(testDelivery));

        mockMvc.perform(get("/api/drivers/1/deliveries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderId").value(200));
    }

    @Test
    void getCurrentDelivery_ShouldReturnDelivery() throws Exception {
        when(driverService.getCurrentDelivery(1L)).thenReturn(testDelivery);

        mockMvc.perform(get("/api/drivers/1/current-delivery"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(200));
    }

    @Test
    void getDriverEarnings_ShouldReturnEarnings() throws Exception {
        Map<String, Object> earnings = Map.of(
                "totalEarnings", new BigDecimal("10.00"),
                "completedDeliveries", 2
        );
        when(driverService.getDriverEarnings(1L)).thenReturn(earnings);

        mockMvc.perform(get("/api/drivers/1/earnings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalEarnings").value(10.00))
                .andExpect(jsonPath("$.completedDeliveries").value(2));
    }
}