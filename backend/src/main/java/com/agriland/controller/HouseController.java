package com.agriland.controller;

import com.agriland.dto.ApiResponse;
import com.agriland.dto.HouseRequest;
import com.agriland.entity.House;
import com.agriland.security.UserPrincipal;
import com.agriland.service.HouseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/houses")
public class HouseController {

    @Autowired
    private HouseService houseService;

    @GetMapping
    public ResponseEntity<List<House>> getAllHouses(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(houseService.getAllActiveHouses(location, propertyType, bedrooms, maxPrice));
    }

    @GetMapping("/{id}")
    public ResponseEntity<House> getHouseById(@PathVariable Long id) {
        return ResponseEntity.ok(houseService.getHouseById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<House>> getMyHouses(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(houseService.getSellerHouses(userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<House> createHouse(
            @Valid @RequestBody HouseRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(houseService.createHouse(request, userPrincipal.getUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<House> updateHouse(
            @PathVariable Long id,
            @Valid @RequestBody HouseRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(houseService.updateHouse(id, request, userPrincipal.getUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteHouse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        houseService.deleteHouse(id, userPrincipal.getUser());
        return ResponseEntity.ok(new ApiResponse(true, "House listing deleted successfully."));
    }
}
