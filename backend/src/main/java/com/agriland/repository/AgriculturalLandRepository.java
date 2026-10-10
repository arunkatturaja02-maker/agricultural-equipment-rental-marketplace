package com.agriland.repository;

import com.agriland.entity.AgriculturalLand;
import com.agriland.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AgriculturalLandRepository extends JpaRepository<AgriculturalLand, Long> {
    List<AgriculturalLand> findBySellerId(Long sellerId);
    List<AgriculturalLand> findByListingStatus(ListingStatus status);

    @Query("SELECT l FROM AgriculturalLand l WHERE l.listingStatus = :status " +
           "AND (:district IS NULL OR :district = '' OR LOWER(l.district) LIKE LOWER(CONCAT('%', :district, '%'))) " +
           "AND (:location IS NULL OR :location = '' OR LOWER(l.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:minPrice IS NULL OR l.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR l.price <= :maxPrice) " +
           "AND (:minArea IS NULL OR l.areaAcres >= :minArea)")
    List<AgriculturalLand> filterLands(
        @Param("status") ListingStatus status,
        @Param("district") String district,
        @Param("location") String location,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("minArea") BigDecimal minArea
    );
}
