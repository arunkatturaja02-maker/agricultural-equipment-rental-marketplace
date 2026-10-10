package com.agriland.service;

import com.agriland.dto.VehicleBookingRequest;
import com.agriland.entity.*;
import com.agriland.exception.BadRequestException;
import com.agriland.repository.VehicleBookingRepository;
import com.agriland.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

public class BookingServiceTest {

    @Mock
    private VehicleBookingRepository bookingRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private BookingService bookingService;

    private User customer;
    private User owner;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        owner = new User("Owner Name", "owner@agriland.com", "9999999999", "pass", "Address", Role.SELLER);
        owner.setId(1L);

        customer = new User("Customer Name", "customer@agriland.com", "8888888888", "pass", "Address", Role.CUSTOMER);
        customer.setId(2L);

        vehicle = new Vehicle();
        vehicle.setId(10L);
        vehicle.setOwner(owner);
        vehicle.setName("Test Tractor");
        vehicle.setCategory("Tractor");
        vehicle.setHourlyRate(new BigDecimal("200.00"));
        vehicle.setDailyRate(new BigDecimal("1500.00"));
    }

    @Test
    void testCreateBooking_OverlappingApproved_ThrowsException() {
        VehicleBookingRequest req = new VehicleBookingRequest();
        req.setVehicleId(10L);
        req.setStartDatetime(LocalDateTime.now().plusDays(1));
        req.setEndDatetime(LocalDateTime.now().plusDays(2));

        when(vehicleRepository.findById(10L)).thenReturn(Optional.of(vehicle));
        when(bookingRepository.hasOverlappingApprovedBooking(
                eq(10L), eq(BookingStatus.APPROVED), any(LocalDateTime.class), any(LocalDateTime.class), any()
        )).thenReturn(true);

        assertThrows(BadRequestException.class, () -> {
            bookingService.createBooking(req, customer);
        });
    }

    @Test
    void testCreateBooking_OwnerBookingOwnVehicle_ThrowsException() {
        VehicleBookingRequest req = new VehicleBookingRequest();
        req.setVehicleId(10L);
        req.setStartDatetime(LocalDateTime.now().plusDays(1));
        req.setEndDatetime(LocalDateTime.now().plusDays(2));

        when(vehicleRepository.findById(10L)).thenReturn(Optional.of(vehicle));

        assertThrows(BadRequestException.class, () -> {
            bookingService.createBooking(req, owner);
        });
    }
}
