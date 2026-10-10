package com.agriland.service;

import com.agriland.dto.AuthRequest;
import com.agriland.dto.AuthResponse;
import com.agriland.dto.ForgotPasswordRequest;
import com.agriland.dto.RegisterRequest;
import com.agriland.entity.Role;
import com.agriland.entity.User;
import com.agriland.exception.BadRequestException;
import com.agriland.exception.ResourceNotFoundException;
import com.agriland.repository.UserRepository;
import com.agriland.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered!");
        }

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Public registration as ADMIN is strictly prohibited.");
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match!");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                passwordEncoder.encode(request.getPassword()),
                request.getAddress(),
                request.getRole()
        );

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress()
        );
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password!");
        }

        if (!user.isEnabled()) {
            throw new BadRequestException("Your account has been disabled. Please contact administrator.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress()
        );
    }

    public String handleForgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String resetToken = UUID.randomUUID().toString();
        // In real email setup, mail sender sends URL with resetToken.
        return "Password reset link and security token (" + resetToken + ") successfully generated for " + user.getEmail() + ". Check your email inbox.";
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
