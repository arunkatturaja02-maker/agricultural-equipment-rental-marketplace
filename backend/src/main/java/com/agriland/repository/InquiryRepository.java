package com.agriland.repository;

import com.agriland.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Inquiry> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
}
