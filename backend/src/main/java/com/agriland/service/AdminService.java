package com.agriland.service;

import com.agriland.dto.AdminDashboardStats;
import com.agriland.entity.*;
import com.agriland.exception.BadRequestException;
import com.agriland.exception.ResourceNotFoundException;
import com.agriland.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AgriculturalLandRepository landRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private VehicleBookingRepository bookingRepository;

    @Autowired
    private InquiryRepository inquiryRepository;

    @Autowired
    private SiteVisitRequestRepository siteVisitRepository;

    public AdminDashboardStats getDashboardStats() {
        AdminDashboardStats stats = new AdminDashboardStats();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCustomers(userRepository.findByRole(Role.CUSTOMER).size());
        stats.setTotalSellers(userRepository.findByRole(Role.SELLER).size());
        stats.setTotalVehicles(vehicleRepository.count());
        stats.setTotalLands(landRepository.count());
        stats.setTotalHouses(houseRepository.count());
        stats.setTotalBookings(bookingRepository.count());
        stats.setTotalInquiries(inquiryRepository.count());
        stats.setTotalSiteVisits(siteVisitRepository.count());
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot disable administrator account.");
        }
        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    public Map<String, Object> getAllListings() {
        Map<String, Object> listings = new HashMap<>();
        listings.put("vehicles", vehicleRepository.findAll());
        listings.put("lands", landRepository.findAll());
        listings.put("houses", houseRepository.findAll());
        return listings;
    }

    @Transactional
    public Object updateListingStatus(String type, Long id, ListingStatus newStatus) {
        switch (type.toLowerCase()) {
            case "vehicle":
            case "vehicles":
                Vehicle vehicle = vehicleRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
                vehicle.setListingStatus(newStatus);
                return vehicleRepository.save(vehicle);
            case "land":
            case "lands":
                AgriculturalLand land = landRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Land", "id", id));
                land.setListingStatus(newStatus);
                return landRepository.save(land);
            case "house":
            case "houses":
                House house = houseRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("House", "id", id));
                house.setListingStatus(newStatus);
                return houseRepository.save(house);
            default:
                throw new BadRequestException("Invalid listing type: " + type);
        }
    }
}
