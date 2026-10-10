package com.agriland.service;

import com.agriland.dto.LandRequest;
import com.agriland.entity.AgriculturalLand;
import com.agriland.entity.ListingStatus;
import com.agriland.entity.User;
import com.agriland.exception.BadRequestException;
import com.agriland.exception.ResourceNotFoundException;
import com.agriland.repository.AgriculturalLandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class LandService {

    @Autowired
    private AgriculturalLandRepository landRepository;

    public List<AgriculturalLand> getAllActiveLands(String district, String location, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minArea) {
        return landRepository.filterLands(ListingStatus.ACTIVE, district, location, minPrice, maxPrice, minArea);
    }

    public AgriculturalLand getLandById(Long id) {
        return landRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AgriculturalLand", "id", id));
    }

    public List<AgriculturalLand> getSellerLands(Long sellerId) {
        return landRepository.findBySellerId(sellerId);
    }

    @Transactional
    public AgriculturalLand createLand(LandRequest request, User seller) {
        AgriculturalLand land = new AgriculturalLand();
        land.setSeller(seller);
        mapRequestToLand(request, land);
        return landRepository.save(land);
    }

    @Transactional
    public AgriculturalLand updateLand(Long id, LandRequest request, User currentSeller) {
        AgriculturalLand land = getLandById(id);
        if (!land.getSeller().getId().equals(currentSeller.getId()) && !currentSeller.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You are not authorized to update this land listing.");
        }
        mapRequestToLand(request, land);
        return landRepository.save(land);
    }

    @Transactional
    public void deleteLand(Long id, User currentSeller) {
        AgriculturalLand land = getLandById(id);
        if (!land.getSeller().getId().equals(currentSeller.getId()) && !currentSeller.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You are not authorized to delete this land listing.");
        }
        landRepository.delete(land);
    }

    private void mapRequestToLand(LandRequest request, AgriculturalLand land) {
        land.setTitle(request.getTitle());
        land.setDescription(request.getDescription());
        land.setLocation(request.getLocation());
        land.setDistrict(request.getDistrict());
        land.setAreaAcres(request.getAreaAcres());
        land.setPrice(request.getPrice());
        land.setSoilType(request.getSoilType());
        land.setWaterAvailability(request.getWaterAvailability());
        land.setElectricityAvailability(request.getElectricityAvailability());
        land.setRoadAccess(request.getRoadAccess());
        if (request.getListingStatus() != null) {
            land.setListingStatus(request.getListingStatus());
        }
        if (request.getImageUrls() != null) {
            land.setImageUrls(request.getImageUrls());
        }
    }
}
