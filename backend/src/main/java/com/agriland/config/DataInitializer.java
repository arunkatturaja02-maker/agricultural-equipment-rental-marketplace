package com.agriland.config;

import com.agriland.entity.*;
import com.agriland.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private AgriculturalLandRepository landRepository;

    @Autowired
    private HouseRepository houseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Ensure Admin exists
        User admin = userRepository.findByEmail("admin@agriland.com").orElseGet(() -> {
            User newAdmin = new User(
                    "System Administrator",
                    "admin@agriland.com",
                    "+919876543210",
                    passwordEncoder.encode("Admin@12345"),
                    "AgriLand Head Office, New Delhi",
                    Role.ADMIN
            );
            return userRepository.save(newAdmin);
        });

        // 2. Ensure Sample Seller exists
        User seller = userRepository.findByEmail("seller@agriland.com").orElseGet(() -> {
            User newSeller = new User(
                    "Ramesh Kumar (Farmer & Landowner)",
                    "seller@agriland.com",
                    "+919812345678",
                    passwordEncoder.encode("Seller@12345"),
                    "Village Kurali, Mohali, Punjab",
                    Role.SELLER
            );
            return userRepository.save(newSeller);
        });

        // 3. Ensure Sample Customer exists
        User customer = userRepository.findByEmail("customer@agriland.com").orElseGet(() -> {
            User newCustomer = new User(
                    "Sanjay Sharma",
                    "customer@agriland.com",
                    "+919898989898",
                    passwordEncoder.encode("Customer@12345"),
                    "Sector 17, Chandigarh",
                    Role.CUSTOMER
            );
            return userRepository.save(newCustomer);
        });

        // 4. Seed Vehicles if empty
        if (vehicleRepository.count() == 0) {
            Vehicle v1 = new Vehicle();
            v1.setOwner(seller);
            v1.setName("Mahindra 575 DI Heavy Tractor");
            v1.setCategory("Tractor");
            v1.setBrand("Mahindra");
            v1.setModel("575 DI - 45 HP");
            v1.setDescription("High power 45 HP tractor equipped with power steering and heavy duty hydraulics, ideal for plowing and haulage.");
            v1.setHourlyRate(new BigDecimal("350.00"));
            v1.setDailyRate(new BigDecimal("2500.00"));
            v1.setLocation("Mohali, Punjab");
            v1.setAvailabilityStatus("AVAILABLE");
            v1.setListingStatus(ListingStatus.ACTIVE);
            v1.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80"
            ));
            vehicleRepository.save(v1);

            Vehicle v2 = new Vehicle();
            v2.setOwner(seller);
            v2.setName("Swaraj 855 FE Multi-crop Harvester");
            v2.setCategory("Harvester");
            v2.setBrand("Swaraj");
            v2.setModel("855 Combine");
            v2.setDescription("Efficient paddy and wheat combine harvester with cutter bar, reducing grain loss during harvest season.");
            v2.setHourlyRate(new BigDecimal("1200.00"));
            v2.setDailyRate(new BigDecimal("8500.00"));
            v2.setLocation("Ludhiana, Punjab");
            v2.setAvailabilityStatus("AVAILABLE");
            v2.setListingStatus(ListingStatus.ACTIVE);
            v2.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1530267981608-bc70a2974868?auto=format&fit=crop&w=800&q=80"
            ));
            vehicleRepository.save(v2);

            Vehicle v3 = new Vehicle();
            v3.setOwner(seller);
            v3.setName("JCB 3DX Eco Backhoe Loader");
            v3.setCategory("JCB");
            v3.setBrand("JCB");
            v3.setModel("3DX Super");
            v3.setDescription("Heavy duty excavator and backhoe loader for farmland leveling, pond digging, and trenching work.");
            v3.setHourlyRate(new BigDecimal("950.00"));
            v3.setDailyRate(new BigDecimal("6800.00"));
            v3.setLocation("Ambala, Haryana");
            v3.setAvailabilityStatus("AVAILABLE");
            v3.setListingStatus(ListingStatus.ACTIVE);
            v3.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&w=800&q=80"
            ));
            vehicleRepository.save(v3);
        }

        // 5. Seed Agricultural Lands if empty
        if (landRepository.count() == 0) {
            AgriculturalLand l1 = new AgriculturalLand();
            l1.setSeller(seller);
            l1.setTitle("Fertile Black Soil Farmland with Borewell");
            l1.setDescription("12 Acres prime fertile agricultural land with 24/7 solar borewell pump, electricity connection, and canal road access.");
            l1.setLocation("Village Kurali, Landran Road");
            l1.setDistrict("Mohali");
            l1.setAreaAcres(new BigDecimal("12.50"));
            l1.setPrice(new BigDecimal("7500000.00"));
            l1.setSoilType("Alluvial Black Soil");
            l1.setWaterAvailability("Submersible Borewell & Canal Water");
            l1.setElectricityAvailability("3-Phase Agricultural Power");
            l1.setRoadAccess("20 ft Tarred Paved Road");
            l1.setListingStatus(ListingStatus.ACTIVE);
            l1.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"
            ));
            landRepository.save(l1);

            AgriculturalLand l2 = new AgriculturalLand();
            l2.setSeller(seller);
            l2.setTitle("Organic Farming Plot Near Highway");
            l2.setDescription("5 Acres certified organic soil farm plot suitable for polyhouse, horticulture, or commercial crops.");
            l2.setLocation("Samrala Highway, Machhiwara");
            l2.setDistrict("Ludhiana");
            l2.setAreaAcres(new BigDecimal("5.00"));
            l2.setPrice(new BigDecimal("3200000.00"));
            l2.setSoilType("Loamy Sandy Soil");
            l2.setWaterAvailability("Deep Tube Well Pump");
            l2.setElectricityAvailability("Commercial Power Available");
            l2.setRoadAccess("Direct Highway Frontage");
            l2.setListingStatus(ListingStatus.ACTIVE);
            l2.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
            ));
            landRepository.save(l2);
        }

        // 6. Seed Houses if empty
        if (houseRepository.count() == 0) {
            House h1 = new House();
            h1.setSeller(seller);
            h1.setTitle("Modern 3BHK Farmhouse Villa with Orchard");
            h1.setDescription("Spacious 3 bedroom independent villa situated amidst lush green farmland. Features modern kitchen, parking, and fruit garden.");
            h1.setLocation("Kharar-Landran Road");
            h1.setPrice(new BigDecimal("6800000.00"));
            h1.setBedrooms(3);
            h1.setBathrooms(3);
            h1.setBuiltUpArea(new BigDecimal("2200.00"));
            h1.setPlotArea(new BigDecimal("4500.00"));
            h1.setPropertyType("Farmhouse");
            h1.setParkingAvailable(true);
            h1.setListingStatus(ListingStatus.ACTIVE);
            h1.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
            ));
            houseRepository.save(h1);

            House h2 = new House();
            h2.setSeller(seller);
            h2.setTitle("2BHK Independent House near Agricultural Hub");
            h2.setDescription("Newly constructed 2 BHK single story home with garage, private yard, and clear title deed.");
            h2.setLocation("Sector 12, Zirakpur");
            h2.setPrice(new BigDecimal("4200000.00"));
            h2.setBedrooms(2);
            h2.setBathrooms(2);
            h2.setBuiltUpArea(new BigDecimal("1350.00"));
            h2.setPlotArea(new BigDecimal("1800.00"));
            h2.setPropertyType("Independent House");
            h2.setParkingAvailable(true);
            h2.setListingStatus(ListingStatus.ACTIVE);
            h2.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"
            ));
            houseRepository.save(h2);
        }
    }
}
