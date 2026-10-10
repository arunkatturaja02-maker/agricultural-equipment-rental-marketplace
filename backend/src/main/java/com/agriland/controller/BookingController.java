package com.agriland.controller;

import com.agriland.dto.ApiResponse;
import com.agriland.dto.VehicleBookingRequest;
import com.agriland.entity.BookingStatus;
import com.agriland.entity.VehicleBooking;
import com.agriland.security.UserPrincipal;
import com.agriland.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<VehicleBooking> createBooking(
            @Valid @RequestBody VehicleBookingRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(bookingService.createBooking(request, userPrincipal.getUser()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<VehicleBooking>> getMyBookings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(userPrincipal.getId()));
    }

    @GetMapping("/owner")
    public ResponseEntity<List<VehicleBooking>> getOwnerBookings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(bookingService.getOwnerBookings(userPrincipal.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VehicleBooking> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, userPrincipal.getUser()));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<VehicleBooking> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userPrincipal.getUser()));
    }
}
