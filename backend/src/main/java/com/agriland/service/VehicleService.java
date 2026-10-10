package com.agriland.service;

import com.agriland.dto.VehicleRequest;
import com.agriland.entity.ListingStatus;
import com.agriland.entity.User;
import com.agriland.entity.Vehicle;
import com.agriland.exception.BadRequestException;
import com.agriland.exception.ResourceNotFoundException;
import com.agriland.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public List<Vehicle> getAllActiveVehicles(String category, String location, String search, BigDecimal maxDailyRate) {
        return vehicleRepository.filterVehicles(ListingStatus.ACTIVE, category, location, search, maxDailyRate);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
    }

    public List<Vehicle> getOwnerVehicles(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }

    @Transactional
    public Vehicle createVehicle(VehicleRequest request, User owner) {
        Vehicle vehicle = new Vehicle();
        vehicle.setOwner(owner);
        mapRequestToVehicle(request, vehicle);
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, VehicleRequest request, User currentOwner) {
        Vehicle vehicle = getVehicleById(id);
        if (!vehicle.getOwner().getId().equals(currentOwner.getId()) && !currentOwner.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You are not authorized to update this vehicle listing.");
        }
        mapRequestToVehicle(request, vehicle);
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id, User currentOwner) {
        Vehicle vehicle = getVehicleById(id);
        if (!vehicle.getOwner().getId().equals(currentOwner.getId()) && !currentOwner.getRole().name().equals("ADMIN")) {
            throw new BadRequestException("You are not authorized to delete this vehicle listing.");
        }
        vehicleRepository.delete(vehicle);
    }

    private void mapRequestToVehicle(VehicleRequest request, Vehicle vehicle) {
        vehicle.setName(request.getName());
        vehicle.setCategory(request.getCategory());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setDescription(request.getDescription());
        vehicle.setHourlyRate(request.getHourlyRate());
        vehicle.setDailyRate(request.getDailyRate());
        vehicle.setLocation(request.getLocation());
        if (request.getAvailabilityStatus() != null) {
            vehicle.setAvailabilityStatus(request.getAvailabilityStatus());
        }
        if (request.getListingStatus() != null) {
            vehicle.setListingStatus(request.getListingStatus());
        }
        if (request.getImageUrls() != null) {
            vehicle.setImageUrls(request.getImageUrls());
        }
    }
}
