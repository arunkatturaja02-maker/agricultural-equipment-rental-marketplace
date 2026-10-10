package com.agriland.controller;

import com.agriland.dto.InquiryRequest;
import com.agriland.entity.Inquiry;
import com.agriland.security.UserPrincipal;
import com.agriland.service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<Inquiry> createInquiry(
            @Valid @RequestBody InquiryRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(inquiryService.createInquiry(request, userPrincipal.getUser()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Inquiry>> getMyInquiries(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(inquiryService.getCustomerInquiries(userPrincipal.getId()));
    }

    @GetMapping("/received")
    public ResponseEntity<List<Inquiry>> getReceivedInquiries(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(inquiryService.getSellerInquiries(userPrincipal.getId()));
    }
}
