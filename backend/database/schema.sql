-- =====================================================
-- SweetShop Database Schema
-- =====================================================

-- Create database (run this first)
CREATE DATABASE IF NOT EXISTS sweetshop_db;
USE sweetshop_db;

-- =====================================================
-- SWEETS TABLE
-- =====================================================

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS sweets;

-- Create sweets table
CREATE TABLE sweets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    in_stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Add indexes for better performance
    INDEX idx_category (category),
    INDEX idx_name (name),
    INDEX idx_price (price),
    INDEX idx_stock (in_stock),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample sweets data
INSERT INTO sweets (name, category, price, in_stock) VALUES
-- Chocolate Category
('Chocolate Truffle', 'Chocolate', 2.50, 25),
('Dark Chocolate Bar', 'Chocolate', 2.00, 30),
('Milk Chocolate Bar', 'Chocolate', 1.75, 40),
('White Chocolate Bar', 'Chocolate', 2.25, 20),
('Chocolate Covered Strawberries', 'Chocolate', 4.00, 15),
('Chocolate Fudge', 'Chocolate', 3.50, 18),

-- Cakes Category
('Vanilla Cupcake', 'Cakes', 3.00, 15),
('Chocolate Cupcake', 'Cakes', 3.25, 12),
('Red Velvet Cake', 'Cakes', 5.00, 8),
('Strawberry Cheesecake', 'Cakes', 4.50, 10),
('Carrot Cake', 'Cakes', 4.25, 7),
('Tiramisu', 'Cakes', 6.00, 5),

-- Candies Category
('Gummy Bears', 'Candies', 1.75, 50),
('Sour Patch Kids', 'Candies', 2.00, 45),
('Jelly Beans', 'Candies', 1.50, 60),
('Hard Candies', 'Candies', 1.25, 35),
('Lollipops', 'Candies', 0.75, 80),
('Marshmallows', 'Candies', 2.25, 25),

-- Ice Cream Category
('Vanilla Ice Cream', 'Ice Cream', 3.75, 20),
('Chocolate Ice Cream', 'Ice Cream', 3.75, 18),
('Strawberry Ice Cream', 'Ice Cream', 3.50, 15),
('Mint Chocolate Chip', 'Ice Cream', 4.00, 12),
('Cookie Dough', 'Ice Cream', 4.25, 10),
('Rocky Road', 'Ice Cream', 4.00, 8),

-- Snacks Category
('Caramel Popcorn', 'Snacks', 2.25, 30),
('Chocolate Covered Nuts', 'Snacks', 3.50, 20),
('Trail Mix', 'Snacks', 2.75, 25),
('Granola Bars', 'Snacks', 1.50, 40),
('Rice Krispies Treats', 'Snacks', 2.00, 35),
('Chocolate Chip Cookies', 'Snacks', 1.75, 45);

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- View all sweets
-- SELECT * FROM sweets ORDER BY created_at DESC;

-- View sweets by category
-- SELECT * FROM sweets WHERE category = 'Chocolate' ORDER BY name;

-- View low stock items (less than 10)
-- SELECT * FROM sweets WHERE in_stock < 10 ORDER BY in_stock ASC;

-- View sweets by price range
-- SELECT * FROM sweets WHERE price BETWEEN 2.00 AND 4.00 ORDER BY price;

-- Search sweets by name
-- SELECT * FROM sweets WHERE name LIKE '%chocolate%' ORDER BY name;

-- Get category statistics
-- SELECT 
--     category,
--     COUNT(*) as total_items,
--     AVG(price) as avg_price,
--     SUM(in_stock) as total_stock
-- FROM sweets 
-- GROUP BY category 
-- ORDER BY total_items DESC;

-- Get total inventory value
-- SELECT 
--     SUM(price * in_stock) as total_inventory_value,
--     COUNT(*) as total_products,
--     AVG(price) as average_price
-- FROM sweets;

-- =====================================================
-- DATABASE MAINTENANCE QUERIES
-- =====================================================

-- Update stock for a specific item
-- UPDATE sweets SET in_stock = in_stock + 10 WHERE id = 1;

-- Update price for a category
-- UPDATE sweets SET price = price * 1.1 WHERE category = 'Chocolate';

-- Delete items with zero stock (optional)
-- DELETE FROM sweets WHERE in_stock = 0;

-- =====================================================
-- VIEWS (Optional - for complex queries)
-- =====================================================

-- Create view for low stock items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT id, name, category, price, in_stock, created_at
FROM sweets 
WHERE in_stock < 10
ORDER BY in_stock ASC;

-- Create view for category summary
CREATE OR REPLACE VIEW category_summary AS
SELECT 
    category,
    COUNT(*) as total_items,
    AVG(price) as avg_price,
    SUM(in_stock) as total_stock,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM sweets 
GROUP BY category 
ORDER BY total_items DESC;

-- =====================================================
-- STORED PROCEDURES (Optional - for complex operations)
-- =====================================================

DELIMITER //

-- Procedure to add stock to an item
CREATE PROCEDURE AddStock(IN sweet_id INT, IN quantity INT)
BEGIN
    DECLARE current_stock INT;
    
    -- Get current stock
    SELECT in_stock INTO current_stock FROM sweets WHERE id = sweet_id;
    
    -- Update stock
    IF current_stock IS NOT NULL THEN
        UPDATE sweets SET in_stock = current_stock + quantity WHERE id = sweet_id;
        SELECT 'Stock updated successfully' as message;
    ELSE
        SELECT 'Sweet not found' as message;
    END IF;
END //

-- Procedure to get sweets by price range
CREATE PROCEDURE GetSweetsByPriceRange(IN min_price DECIMAL(10,2), IN max_price DECIMAL(10,2))
BEGIN
    SELECT * FROM sweets 
    WHERE price BETWEEN min_price AND max_price 
    ORDER BY price ASC;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS (Optional - for data integrity)
-- =====================================================

DELIMITER //

-- Trigger to prevent negative stock
CREATE TRIGGER before_stock_update
BEFORE UPDATE ON sweets
FOR EACH ROW
BEGIN
    IF NEW.in_stock < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock cannot be negative';
    END IF;
END //

-- Trigger to prevent negative price
CREATE TRIGGER before_price_update
BEFORE UPDATE ON sweets
FOR EACH ROW
BEGIN
    IF NEW.price < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Price cannot be negative';
    END IF;
END //

DELIMITER ;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify table structure
DESCRIBE sweets;

-- Verify sample data
SELECT COUNT(*) as total_sweets FROM sweets;

-- Verify categories
SELECT DISTINCT category FROM sweets ORDER BY category;

-- Verify low stock view
SELECT * FROM low_stock_items;

-- Verify category summary
SELECT * FROM category_summary; 