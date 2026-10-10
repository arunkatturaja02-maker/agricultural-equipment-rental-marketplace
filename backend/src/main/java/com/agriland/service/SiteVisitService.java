package com.agriland.service;

import com.agriland.dto.SiteVisitCreateRequest;
import com.agriland.entity.*;
import com.agriland.exception.BadRequestException;
import com.agriland.exception.ResourceNotFoundException;
import com.agriland.repository.AgriculturalLandRepository;
import com.agriland.repository.HouseRepository;
import com.agriland.repository.SiteVisitRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SiteVisitService {

    @Autowired
    private SiteVisitRequestRepository siteVisitRepository;

    @Autowired
    private AgriculturalLandRepository landRepository;

    @Autowired
    private HouseRepository houseRepository;

    public List<SiteVisitRequest> getCustomerVisits(Long customerId) {
        return siteVisitRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<SiteVisitRequest> getSellerVisits(Long sellerId) {
        return siteVisitRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
    }

    @Transactional
    public SiteVisitRequest createVisitRequest(SiteVisitCreateRequest request, User customer) {
        User seller = null;

        if (request.getListingType() == ListingType.LAND) {
            AgriculturalLand land = landRepository.findById(request.getListingId())
                    .orElseThrow(() -> new BadRequestException("Land listing not found"));
            seller = land.getSeller();
        } else if (request.getListingType() == ListingType.HOUSE) {
            House house = houseRepository.findById(request.getListingId())
                    .orElseThrow(() -> new BadRequestException("House listing not found"));
            seller = house.getSeller();
        } else {
            throw new BadRequestException("Site visits are only supported for Land and House listings.");
        }

        if (seller.getId().equals(customer.getId())) {
            throw new BadRequestException("You cannot request site visits for your own listing.");
        }

        SiteVisitRequest visit = new SiteVisitRequest();
        visit.setCustomer(customer);
        visit.setSeller(seller);
        visit.setListingType(request.getListingType());
        visit.setListingId(request.getListingId());
        visit.setRequestedDatetime(request.getRequestedDatetime());
        visit.setVisitStatus(VisitStatus.PENDING);

        return siteVisitRepository.save(visit);
    }

    @Transactional
    public SiteVisitRequest updateVisitStatus(Long id, VisitStatus newStatus, User seller) {
        SiteVisitRequest visit = siteVisitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SiteVisitRequest", "id", id));

        if (!visit.getSeller().getId().equals(seller.getId()) && !seller.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("Not authorized to update this site visit request.");
        }

        visit.setVisitStatus(newStatus);
        return siteVisitRepository.save(visit);
    }
}
