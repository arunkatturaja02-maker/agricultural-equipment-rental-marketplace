package com.agriland.dto;

import com.agriland.entity.ListingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class InquiryRequest {

    @NotNull(message = "Listing type is required")
    private ListingType listingType;

    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotBlank(message = "Message is required")
    private String message;

    public InquiryRequest() {}

    public ListingType getListingType() {
        return listingType;
    }

    public void setListingType(ListingType listingType) {
        this.listingType = listingType;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
