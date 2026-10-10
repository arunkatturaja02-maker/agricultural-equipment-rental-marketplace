package com.agriland.controller;

import com.agriland.dto.ApiResponse;
import com.agriland.dto.LandRequest;
import com.agriland.entity.AgriculturalLand;
import com.agriland.security.UserPrincipal;
import com.agriland.service.LandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/lands")
public class LandController {

    @Autowired
    private LandService landService;

    @GetMapping
    public ResponseEntity<List<AgriculturalLand>> getAllLands(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minArea) {
        return ResponseEntity.ok(landService.getAllActiveLands(district, location, minPrice, maxPrice, minArea));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgriculturalLand> getLandById(@PathVariable Long id) {
        return ResponseEntity.ok(landService.getLandById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AgriculturalLand>> getMyLands(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(landService.getSellerLands(userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<AgriculturalLand> createLand(
            @Valid @RequestBody LandRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(landService.createLand(request, userPrincipal.getUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgriculturalLand> updateLand(
            @PathVariable Long id,
            @Valid @RequestBody LandRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(landService.updateLand(id, request, userPrincipal.getUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteLand(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        landService.deleteLand(id, userPrincipal.getUser());
        return ResponseEntity.ok(new ApiResponse(true, "Land listing deleted successfully."));
    }
}
