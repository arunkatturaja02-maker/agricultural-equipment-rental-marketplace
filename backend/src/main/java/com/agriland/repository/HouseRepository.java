package com.agriland.repository;

import com.agriland.entity.House;
import com.agriland.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HouseRepository extends JpaRepository<House, Long> {
    List<House> findBySellerId(Long sellerId);
    List<House> findByListingStatus(ListingStatus status);

    @Query("SELECT h FROM House h WHERE h.listingStatus = :status " +
           "AND (:location IS NULL OR :location = '' OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:propertyType IS NULL OR :propertyType = '' OR LOWER(h.propertyType) = LOWER(:propertyType)) " +
           "AND (:bedrooms IS NULL OR h.bedrooms >= :bedrooms) " +
           "AND (:maxPrice IS NULL OR h.price <= :maxPrice)")
    List<House> filterHouses(
        @Param("status") ListingStatus status,
        @Param("location") String location,
        @Param("propertyType") String propertyType,
        @Param("bedrooms") Integer bedrooms,
        @Param("maxPrice") BigDecimal maxPrice
    );
}
