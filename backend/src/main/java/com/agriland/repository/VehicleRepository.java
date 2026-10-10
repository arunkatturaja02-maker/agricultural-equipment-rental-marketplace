package com.agriland.repository;

import com.agriland.entity.ListingStatus;
import com.agriland.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByOwnerId(Long ownerId);
    List<Vehicle> findByListingStatus(ListingStatus status);

    @Query("SELECT v FROM Vehicle v WHERE v.listingStatus = :status " +
           "AND (:category IS NULL OR :category = '' OR LOWER(v.category) = LOWER(:category)) " +
           "AND (:location IS NULL OR :location = '' OR LOWER(v.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:search IS NULL OR :search = '' OR LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(v.brand) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:maxDailyRate IS NULL OR v.dailyRate <= :maxDailyRate)")
    List<Vehicle> filterVehicles(
        @Param("status") ListingStatus status,
        @Param("category") String category,
        @Param("location") String location,
        @Param("search") String search,
        @Param("maxDailyRate") BigDecimal maxDailyRate
    );
}
