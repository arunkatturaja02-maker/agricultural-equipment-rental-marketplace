package com.agriland.dto;

import com.agriland.entity.ListingStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class LandRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "District is required")
    private String district;

    @NotNull(message = "Area in acres is required")
    @DecimalMin(value = "0.01", message = "Area must be greater than 0")
    private BigDecimal areaAcres;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private String soilType;
    private String waterAvailability;
    private String electricityAvailability;
    private String roadAccess;

    private ListingStatus listingStatus = ListingStatus.ACTIVE;
    private List<String> imageUrls;

    public LandRequest() {}

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
}
