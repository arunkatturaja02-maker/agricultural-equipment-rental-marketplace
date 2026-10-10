package com.agriland.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agricultural_lands")
public class AgriculturalLand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String district;

    @Column(name = "area_acres", nullable = false)
    private BigDecimal areaAcres;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "soil_type")
    private String soilType;

    @Column(name = "water_availability")
    private String waterAvailability;

    @Column(name = "electricity_availability")
    private String electricityAvailability;

    @Column(name = "road_access")
    private String roadAccess;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_status")
    private ListingStatus listingStatus = ListingStatus.ACTIVE;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "land_images", joinColumns = @JoinColumn(name = "land_id"))
    @Column(name = "image_url", length = 500)
    private List<String> imageUrls = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AgriculturalLand() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public BigDecimal getAreaAcres() {
        return areaAcres;
    }

    public void setAreaAcres(BigDecimal areaAcres) {
        this.areaAcres = areaAcres;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getWaterAvailability() {
        return waterAvailability;
    }

    public void setWaterAvailability(String waterAvailability) {
        this.waterAvailability = waterAvailability;
    }

    public String getElectricityAvailability() {
        return electricityAvailability;
    }

    public void setElectricityAvailability(String electricityAvailability) {
        this.electricityAvailability = electricityAvailability;
    }

    public String getRoadAccess() {
        return roadAccess;
    }

    public void setRoadAccess(String roadAccess) {
        this.roadAccess = roadAccess;
    }

    public ListingStatus getListingStatus() {
        return listingStatus;
    }

    public void setListingStatus(ListingStatus listingStatus) {
        this.listingStatus = listingStatus;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
