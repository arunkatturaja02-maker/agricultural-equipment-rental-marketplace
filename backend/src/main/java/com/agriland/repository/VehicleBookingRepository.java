package com.agriland.repository;

import com.agriland.entity.BookingStatus;
import com.agriland.entity.VehicleBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VehicleBookingRepository extends JpaRepository<VehicleBooking, Long> {
    List<VehicleBooking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<VehicleBooking> findByVehicleOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<VehicleBooking> findByVehicleId(Long vehicleId);

    @Query("SELECT COUNT(b) > 0 FROM VehicleBooking b WHERE b.vehicle.id = :vehicleId " +
           "AND b.bookingStatus = :status " +
           "AND b.startDatetime < :endDatetime AND b.endDatetime > :startDatetime " +
           "AND (:excludeBookingId IS NULL OR b.id <> :excludeBookingId)")
    boolean hasOverlappingApprovedBooking(
        @Param("vehicleId") Long vehicleId,
        @Param("status") BookingStatus status,
        @Param("startDatetime") LocalDateTime startDatetime,
        @Param("endDatetime") LocalDateTime endDatetime,
        @Param("excludeBookingId") Long excludeBookingId
    );
}
