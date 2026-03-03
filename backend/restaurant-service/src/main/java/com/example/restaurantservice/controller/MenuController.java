package com.example.restaurantservice.controller;

import com.example.restaurantservice.model.MenuItem;
import com.example.restaurantservice.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menu")
@RequiredArgsConstructor
public class MenuController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenuItems(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(restaurantService.getMenuItems(restaurantId));
    }

    @PostMapping
    public ResponseEntity<MenuItem> addMenuItem(@PathVariable Long restaurantId, @RequestBody MenuItem menuItem) {
        return ResponseEntity.status(HttpStatus.CREATED).body(restaurantService.addMenuItem(restaurantId, menuItem));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long itemId, @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(restaurantService.updateMenuItem(itemId, menuItem));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long itemId) {
        restaurantService.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }
}
