package com.example.orderservice.controller;

import com.example.orderservice.model.Rating;
import com.example.orderservice.service.RatingRequest;
import com.example.orderservice.service.RatingService;
import com.example.orderservice.service.RatingUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody RatingRequest request) {
        return ResponseEntity.ok(ratingService.createRating(request));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Rating>> getRatingsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(ratingService.getRatingsByRestaurant(restaurantId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rating>> getRatingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingsByUser(userId));
    }

    @GetMapping("/restaurant/{restaurantId}/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long restaurantId) {
        Double avg = ratingService.getAverageRating(restaurantId);
        return ResponseEntity.ok(Map.of(
                "restaurantId", restaurantId,
                "averageRating", avg != null ? avg : 0.0,
                "totalRatings", ratingService.getRatingsByRestaurant(restaurantId).size()
        ));
    }

    @PutMapping("/{ratingId}")
    public ResponseEntity<Rating> updateRating(
            @PathVariable Long ratingId,
            @RequestBody RatingUpdateRequest request) {
        return ResponseEntity.ok(ratingService.updateRating(ratingId, request));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.ok().build();
    }
}