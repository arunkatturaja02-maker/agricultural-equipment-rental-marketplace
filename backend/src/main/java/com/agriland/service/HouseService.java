package com.agriland.service;

import com.agriland.dto.HouseRequest;
import com.agriland.entity.House;
import com.agriland.entity.ListingStatus;
import com.agriland.entity.User;
import com.agriland.exception.BadRequestException;
import com.agriland.exception.ResourceNotFoundException;
import com.agriland.repository.HouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class HouseService {

    @Autowired
    private HouseRepository houseRepository;

    public List<House> getAllActiveHouses(String location, String propertyType, Integer bedrooms, BigDecimal maxPrice) {
        return houseRepository.filterHouses(ListingStatus.ACTIVE, location, propertyType, bedrooms, maxPrice);
    }

    public House getHouseById(Long id) {
        return houseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("House", "id", id));
    }

    public List<House> getSellerHouses(Long sellerId) {
        return houseRepository.findBySellerId(sellerId);
    }

    @Transactional
    public House createHouse(HouseRequest request, User seller) {
        House house = new House();
        house.setSeller(seller);
        mapRequestToHouse(request, house);
        return houseRepository.save(house);
    }

    @Transactional
    public House updateHouse(Long id, HouseRequest request, User currentSeller) {
        House house = getHouseById(id);
        if (!house.getSeller().getId().equals(currentSeller.getId()) && !currentSeller.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You are not authorized to update this house listing.");
        }
        mapRequestToHouse(request, house);
        return houseRepository.save(house);
    }

    @Transactional
    public void deleteHouse(Long id, User currentSeller) {
        House house = getHouseById(id);
        if (!house.getSeller().getId().equals(currentSeller.getId()) && !currentSeller.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You are not authorized to delete this house listing.");
        }
        houseRepository.delete(house);
    }

    private void mapRequestToHouse(HouseRequest request, House house) {
        house.setTitle(request.getTitle());
        house.setDescription(request.getDescription());
        house.setLocation(request.getLocation());
        house.setPrice(request.getPrice());
        house.setBedrooms(request.getBedrooms());
        house.setBathrooms(request.getBathrooms());
        house.setBuiltUpArea(request.getBuiltUpArea());
        house.setPlotArea(request.getPlotArea());
        if (request.getPropertyType() != null) {
            house.setPropertyType(request.getPropertyType());
        }
        house.setParkingAvailable(request.isParkingAvailable());
        if (request.getListingStatus() != null) {
            house.setListingStatus(request.getListingStatus());
        }
        if (request.getImageUrls() != null) {
            house.setImageUrls(request.getImageUrls());
        }
    }
}
