-- City Table
CREATE TABLE city (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Country Table
CREATE TABLE country (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Customer Table
CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    nic VARCHAR(20) NOT NULL UNIQUE
);

-- Mobile Numbers Table
CREATE TABLE customer_mobile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR(15) NOT NULL,
    customer_id BIGINT,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- Addresses Table
CREATE TABLE address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city_id BIGINT,
    country_id BIGINT,
    customer_id BIGINT,
    FOREIGN KEY (city_id) REFERENCES city(id),
    FOREIGN KEY (country_id) REFERENCES country(id),
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

-- Family Relations Table
CREATE TABLE family_relation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    family_member_id BIGINT,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
    FOREIGN KEY (family_member_id) REFERENCES customer(id) ON DELETE CASCADE
);
