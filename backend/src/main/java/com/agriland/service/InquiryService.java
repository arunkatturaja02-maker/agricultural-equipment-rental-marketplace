package com.agriland.service;

import com.agriland.dto.InquiryRequest;
import com.agriland.entity.*;
import com.agriland.exception.BadRequestException;
import com.agriland.repository.AgriculturalLandRepository;
import com.agriland.repository.HouseRepository;
import com.agriland.repository.InquiryRepository;
import com.agriland.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InquiryService {

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AgriculturalLandRepository landRepository;

    @Autowired
    private HouseRepository houseRepository;

    public List<Inquiry> getCustomerInquiries(Long customerId) {
        return inquiryRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Inquiry> getSellerInquiries(Long sellerId) {
        return inquiryRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
    }

    @Transactional
    public Inquiry createInquiry(InquiryRequest request, User customer) {
        User seller = null;

        if (request.getListingType() == ListingType.VEHICLE) {
            Vehicle vehicle = vehicleRepository.findById(request.getListingId())
                    .orElseThrow(() -> new BadRequestException("Vehicle not found for inquiry"));
            seller = vehicle.getOwner();
        } else if (request.getListingType() == ListingType.LAND) {
            AgriculturalLand land = landRepository.findById(request.getListingId())
                    .orElseThrow(() -> new BadRequestException("Land listing not found for inquiry"));
            seller = land.getSeller();
        } else if (request.getListingType() == ListingType.HOUSE) {
            House house = houseRepository.findById(request.getListingId())
                    .orElseThrow(() -> new BadRequestException("House listing not found for inquiry"));
            seller = house.getSeller();
        }

        if (seller == null) {
            throw new BadRequestException("Listing not found for inquiry.");
        }

        if (seller.getId().equals(customer.getId())) {
            throw new BadRequestException("You cannot send inquiries to your own listing.");
        }

        Inquiry inquiry = new Inquiry();
        inquiry.setCustomer(customer);
        inquiry.setSeller(seller);
        inquiry.setListingType(request.getListingType());
        inquiry.setListingId(request.getListingId());
        inquiry.setMessage(request.getMessage());
        inquiry.setInquiryStatus(InquiryStatus.NEW);

        return inquiryRepository.save(inquiry);
    }
}
