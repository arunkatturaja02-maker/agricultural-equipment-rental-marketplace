package com.agriland.dto;

import com.agriland.entity.ListingType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class SiteVisitCreateRequest {

    @NotNull(message = "Listing type is required")
    private ListingType listingType; // LAND or HOUSE

    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotNull(message = "Requested datetime is required")
    private LocalDateTime requestedDatetime;

    public SiteVisitCreateRequest() {}

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

    public LocalDateTime getRequestedDatetime() {
        return requestedDatetime;
    }

    public void setRequestedDatetime(LocalDateTime requestedDatetime) {
        this.requestedDatetime = requestedDatetime;
    }
}
