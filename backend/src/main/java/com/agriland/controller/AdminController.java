package com.agriland.controller;

import com.agriland.dto.AdminDashboardStats;
import com.agriland.entity.ListingStatus;
import com.agriland.entity.User;
import com.agriland.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id, @RequestParam boolean enabled) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id, enabled));
    }

    @GetMapping("/listings")
    public ResponseEntity<Map<String, Object>> getAllListings() {
        return ResponseEntity.ok(adminService.getAllListings());
    }

    @PatchMapping("/listings/{type}/{id}/status")
    public ResponseEntity<Object> updateListingStatus(
            @PathVariable String type,
            @PathVariable Long id,
            @RequestParam ListingStatus status) {
        return ResponseEntity.ok(adminService.updateListingStatus(type, id, status));
    }
}
