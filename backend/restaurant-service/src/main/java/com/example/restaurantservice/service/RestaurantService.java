package com.example.restaurantservice.service;

import com.example.restaurantservice.dto.MenuItemRequest;
import com.example.restaurantservice.dto.RestaurantRequest;
import com.example.restaurantservice.model.MenuItem;
import com.example.restaurantservice.model.Restaurant;
import com.example.restaurantservice.repository.MenuItemRepository;
import com.example.restaurantservice.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findByActiveTrueAndOpenTrue();
    }

    public List<Restaurant> getAllRestaurantsIncludingClosed() {
        return restaurantRepository.findByActiveTrue();
    }

    public Restaurant getRestaurant(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public Restaurant createRestaurant(RestaurantRequest request) {
        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .phone(request.getPhone())
                .category(request.getCategory())
                .image(request.getImage())
                .deliveryTime(request.getDeliveryTime())
                .ownerId(request.getOwnerId())
                .build();
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getRestaurantsByOwner(Long ownerId) {
        return restaurantRepository.findByOwnerId(ownerId);
    }

    public Restaurant updateRestaurant(Long id, RestaurantRequest request) {
        Restaurant restaurant = getRestaurant(id);
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setCategory(request.getCategory());
        restaurant.setImage(request.getImage());
        restaurant.setDeliveryTime(request.getDeliveryTime());
        return restaurantRepository.save(restaurant);
    }

    public Restaurant toggleOpen(Long id) {
        Restaurant restaurant = getRestaurant(id);
        restaurant.setOpen(!restaurant.isOpen());
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        Restaurant restaurant = getRestaurant(id);
        restaurant.setActive(false);
        restaurantRepository.save(restaurant);
    }

    public List<MenuItem> getMenuItems(Long restaurantId) {
        return menuItemRepository.findByRestaurantIdAndAvailableTrue(restaurantId);
    }

    public MenuItem addMenuItem(Long restaurantId, MenuItemRequest request) {
        Restaurant restaurant = getRestaurant(restaurantId);
        MenuItem menuItem = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .restaurant(restaurant)
                .available(true)
                .build();
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long itemId, MenuItemRequest request) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setImageUrl(request.getImageUrl());
        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuItem.setAvailable(false);
        menuItemRepository.save(menuItem);
    }
}
