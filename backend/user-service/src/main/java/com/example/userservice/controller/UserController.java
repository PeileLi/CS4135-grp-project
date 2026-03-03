package com.example.userservice.controller;

import com.example.userservice.dto.RegisterRequest;
import com.example.userservice.model.User;
import com.example.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(userService.getCurrentUser(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateUser(@RequestHeader("X-User-Id") Long userId,
                                           @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.updateUser(userId, request));
    }
}
