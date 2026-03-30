package com.example.userservice.controller;

import com.example.userservice.model.Favourite;
import com.example.userservice.service.FavouriteRequest;
import com.example.userservice.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;

    @PostMapping
    public ResponseEntity<Favourite> addFavourite(@RequestBody FavouriteRequest request) {
        return ResponseEntity.ok(favouriteService.addFavourite(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Favourite>> getUserFavourites(@PathVariable Long userId) {
        return ResponseEntity.ok(favouriteService.getUserFavourites(userId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkFavourite(
            @RequestParam Long userId,
            @RequestParam Long restaurantId) {
        return ResponseEntity.ok(favouriteService.isFavourite(userId, restaurantId));
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFavourite(
            @RequestParam Long userId,
            @RequestParam Long restaurantId) {
        favouriteService.removeFavourite(userId, restaurantId);
        return ResponseEntity.ok().build();
    }
}