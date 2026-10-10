-- AgriLand & Vehicle Rental Marketplace Database Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER', -- 'CUSTOMER', 'SELLER', 'ADMIN'
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Tractor', 'JCB', 'Harvester', 'Rotavator', etc.
    brand VARCHAR(80),
    model VARCHAR(80),
    description TEXT,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    location VARCHAR(150) NOT NULL,
    availability_status VARCHAR(20) DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'BOOKED', 'MAINTENANCE'
    listing_status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'DISABLED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Vehicle Images Table
CREATE TABLE IF NOT EXISTS vehicle_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- 4. Vehicle Bookings Table
CREATE TABLE IF NOT EXISTS vehicle_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Agricultural Lands Table
CREATE TABLE IF NOT EXISTS agricultural_lands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    area_acres DECIMAL(10, 2) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    soil_type VARCHAR(50),
    water_availability VARCHAR(100),
    electricity_availability VARCHAR(100),
    road_access VARCHAR(100),
    listing_status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'SOLD', 'DISABLED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Land Images Table
CREATE TABLE IF NOT EXISTS land_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    land_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (land_id) REFERENCES agricultural_lands(id) ON DELETE CASCADE
);

-- 7. Houses Table
CREATE TABLE IF NOT EXISTS houses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    built_up_area DECIMAL(10, 2) NOT NULL,
    plot_area DECIMAL(10, 2),
    property_type VARCHAR(50) DEFAULT 'Independent House', -- 'Independent House', 'Villa', 'Farmhouse'
    parking_available BOOLEAN DEFAULT TRUE,
    listing_status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'SOLD', 'DISABLED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. House Images Table
CREATE TABLE IF NOT EXISTS house_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    house_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
);

-- 9. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    listing_type VARCHAR(30) NOT NULL, -- 'VEHICLE', 'LAND', 'HOUSE'
    listing_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    inquiry_status VARCHAR(20) DEFAULT 'NEW', -- 'NEW', 'READ', 'RESPONDED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Site Visit Requests Table
CREATE TABLE IF NOT EXISTS site_visit_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    listing_type VARCHAR(30) NOT NULL, -- 'LAND', 'HOUSE'
    listing_id BIGINT NOT NULL,
    requested_datetime DATETIME NOT NULL,
    visit_status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);
