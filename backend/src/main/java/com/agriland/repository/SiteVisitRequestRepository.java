package com.agriland.repository;

import com.agriland.entity.SiteVisitRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteVisitRequestRepository extends JpaRepository<SiteVisitRequest, Long> {
    List<SiteVisitRequest> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<SiteVisitRequest> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
}
