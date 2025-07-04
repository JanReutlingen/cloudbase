# init script
GRANT ALL PRIVILEGES ON hotel.* TO 'hoteluser' @'%';

FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS hotel;

ALTER DATABASE hotel CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

SET NAMES 'utf8mb4';

USE hotel;


-- Create rooms table with all room information
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_key` varchar(50) NOT NULL UNIQUE,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `max_guests` int(11) DEFAULT 2,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_room_key` (`room_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert room data

DELETE FROM `rooms`;
INSERT INTO `rooms` (`room_key`, `title`, `description`, `price_per_night`, `image_path`, `max_guests`) VALUES
('room1', 'SUNRISE BEACH VILLA', 'Cozy single room with sea view, queen bed, ensuite bathroom.', 120.00, '/images/room1.jpg', 2),
('room2', 'LUNA LAGOON VILLA', 'Spacious double room, balcony, king bed, modern amenities.', 140.00, '/images/room2.jpg', 2),
('room3', 'OCEAN EMBER RESIDENCE', 'Deluxe suite, living area, oceanfront, luxury bath.', 160.00, '/images/room3.jpg', 4),
('room4', 'AZURE HAVEN RETREAT', 'Family room, two double beds, garden view, kids welcome.', 180.00, '/images/room4.jpg', 4),
('room5', 'EMERALD FAMILY BEACH VILLA', 'Executive suite, workspace, lounge, premium comfort.', 200.00, '/images/room5.jpg', 6),
('room6', 'CORAL HORIZON SUITE', 'Penthouse, panoramic view, private terrace, luxury amenities.', 220.00, '/images/room6.jpg', 4),
('room7', 'THE ELYSIAN PRIVATE ISLAND', 'Villa, private pool, kitchen, exclusive retreat.', 250.00, '/images/private4.jpg', 8);

-- Create events table
CREATE TABLE IF NOT EXISTS `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_key` varchar(50) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_event_key` (`event_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert event data

DELETE FROM `events`;
INSERT INTO `events` (`event_key`, `name`, `price`, `description`) VALUES
('wedding', 'Wedding', 2000.00, 'Complete wedding ceremony package'),
('yacht', 'Yacht', 500.00, 'Private yacht experience'),
('massage', 'Massage', 80.00, 'Relaxing spa massage'),
('snorkeling', 'Snorkeling', 120.00, 'Underwater adventure tour');