package com.agriland.service;

import com.agriland.dto.VehicleBookingRequest;
import com.agriland.entity.BookingStatus;
import com.agriland.entity.User;
import com.agriland.entity.Vehicle;
import com.agriland.entity.VehicleBooking;
import com.agriland.exception.BadRequestException;
import com.agriland.exception.ResourceNotFoundException;
import com.agriland.repository.VehicleBookingRepository;
import com.agriland.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private VehicleBookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<VehicleBooking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<VehicleBooking> getOwnerBookings(Long ownerId) {
        return bookingRepository.findByVehicleOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public VehicleBooking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));
    }

    @Transactional
    public VehicleBooking createBooking(VehicleBookingRequest request, User customer) {
        if (request.getStartDatetime().isBefore(LocalDateTime.now().minusMinutes(5))) {
            throw new BadRequestException("Start time cannot be in the past.");
        }
        if (request.getEndDatetime().isBefore(request.getStartDatetime()) || request.getEndDatetime().equals(request.getStartDatetime())) {
            throw new BadRequestException("End time must be after start time.");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", request.getVehicleId()));

        if (vehicle.getOwner().getId().equals(customer.getId())) {
            throw new BadRequestException("Owners cannot book their own vehicles.");
        }

        // Check overlapping approved bookings
        boolean hasOverlap = bookingRepository.hasOverlappingApprovedBooking(
                vehicle.getId(),
                BookingStatus.APPROVED,
                request.getStartDatetime(),
                request.getEndDatetime(),
                null
        );

        if (hasOverlap) {
            throw new BadRequestException("Vehicle is already booked and approved for the selected timeframe.");
        }

        BigDecimal totalAmount = calculateBookingCost(vehicle, request.getStartDatetime(), request.getEndDatetime());

        VehicleBooking booking = new VehicleBooking();
        booking.setVehicle(vehicle);
        booking.setCustomer(customer);
        booking.setStartDatetime(request.getStartDatetime());
        booking.setEndDatetime(request.getEndDatetime());
        booking.setTotalAmount(totalAmount);
        booking.setBookingStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    @Transactional
    public VehicleBooking updateBookingStatus(Long bookingId, BookingStatus newStatus, User owner) {
        VehicleBooking booking = getBookingById(bookingId);

        if (!booking.getVehicle().getOwner().getId().equals(owner.getId()) && !owner.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Only the vehicle owner can approve or reject booking requests.");
        }

        if (newStatus == BookingStatus.APPROVED) {
            // Re-verify overlap check before approving
            boolean hasOverlap = bookingRepository.hasOverlappingApprovedBooking(
                    booking.getVehicle().getId(),
                    BookingStatus.APPROVED,
                    booking.getStartDatetime(),
                    booking.getEndDatetime(),
                    booking.getId()
            );
            if (hasOverlap) {
                throw new BadRequestException("Cannot approve: Overlapping approved booking exists for this timeframe.");
            }
        }

        booking.setBookingStatus(newStatus);
        return bookingRepository.save(booking);
    }

    @Transactional
    public VehicleBooking cancelBooking(Long bookingId, User customer) {
        VehicleBooking booking = getBookingById(bookingId);

        if (!booking.getCustomer().getId().equals(customer.getId()) && !customer.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You can only cancel your own bookings.");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled.");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    private BigDecimal calculateBookingCost(Vehicle vehicle, LocalDateTime start, LocalDateTime end) {
        Duration duration = Duration.between(start, end);
        long totalHours = Math.max(1, duration.toHours());
        long days = totalHours / 24;
        long remainingHours = totalHours % 24;

        if (days > 0) {
            BigDecimal daysCost = vehicle.getDailyRate().multiply(BigDecimal.valueOf(days));
            BigDecimal hoursCost = vehicle.getHourlyRate().multiply(BigDecimal.valueOf(remainingHours));
            return daysCost.add(hoursCost).setScale(2, RoundingMode.HALF_UP);
        } else {
            return vehicle.getHourlyRate().multiply(BigDecimal.valueOf(totalHours)).setScale(2, RoundingMode.HALF_UP);
        }
    }
}
