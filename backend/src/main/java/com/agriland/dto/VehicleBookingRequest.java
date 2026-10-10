package com.agriland.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class VehicleBookingRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Start date time is required")
    private LocalDateTime startDatetime;

    @NotNull(message = "End date time is required")
    private LocalDateTime endDatetime;

    public VehicleBookingRequest() {}

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public LocalDateTime getStartDatetime() {
        return startDatetime;
    }

    public void setStartDatetime(LocalDateTime startDatetime) {
        this.startDatetime = startDatetime;
    }

    public LocalDateTime getEndDatetime() {
        return endDatetime;
    }

    public void setEndDatetime(LocalDateTime endDatetime) {
        this.endDatetime = endDatetime;
    }
}
