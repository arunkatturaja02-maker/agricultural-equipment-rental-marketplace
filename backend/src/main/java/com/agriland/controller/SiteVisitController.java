package com.agriland.controller;

import com.agriland.dto.SiteVisitCreateRequest;
import com.agriland.entity.SiteVisitRequest;
import com.agriland.entity.VisitStatus;
import com.agriland.security.UserPrincipal;
import com.agriland.service.SiteVisitService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/site-visits")
public class SiteVisitController {

    @Autowired
    private SiteVisitService siteVisitService;

    @PostMapping
    public ResponseEntity<SiteVisitRequest> createVisitRequest(
            @Valid @RequestBody SiteVisitCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(siteVisitService.createVisitRequest(request, userPrincipal.getUser()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<SiteVisitRequest>> getMyVisits(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(siteVisitService.getCustomerVisits(userPrincipal.getId()));
    }

    @GetMapping("/received")
    public ResponseEntity<List<SiteVisitRequest>> getReceivedVisits(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(siteVisitService.getSellerVisits(userPrincipal.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SiteVisitRequest> updateVisitStatus(
            @PathVariable Long id,
            @RequestParam VisitStatus status,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(siteVisitService.updateVisitStatus(id, status, userPrincipal.getUser()));
    }
}
