package com.agriland.controller;

import com.agriland.dto.ApiResponse;
import com.agriland.dto.VehicleRequest;
import com.agriland.entity.Vehicle;
import com.agriland.security.UserPrincipal;
import com.agriland.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal maxDailyRate) {
        return ResponseEntity.ok(vehicleService.getAllActiveVehicles(category, location, search, maxDailyRate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Vehicle>> getMyVehicles(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(vehicleService.getOwnerVehicles(userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(
            @Valid @RequestBody VehicleRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(vehicleService.createVehicle(request, userPrincipal.getUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request, userPrincipal.getUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteVehicle(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        vehicleService.deleteVehicle(id, userPrincipal.getUser());
        return ResponseEntity.ok(new ApiResponse(true, "Vehicle listing deleted successfully."));
    }
}
