# Hotel Booking System with MariaDB Integration

This hotel booking system now uses MariaDB to store and retrieve room and event data dynamically.

## Database Integration Features

- ✅ MariaDB database with rooms and events tables
- ✅ Dynamic room loading from database
- ✅ Dynamic event pricing from database
- ✅ Environment-based configuration
- ✅ Docker Compose setup with database initialization
- ✅ Fallback to hardcoded values if database fails

## Quick Start

1. **Start the application with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **The database will be automatically initialized with:**
   - 7 room types with dynamic pricing
   - 4 event types with pricing
   - Tables: `rooms` and `events`

3. **Access the application:**
   - Web application: http://localhost:80
   - Database: localhost:3306

## Database Schema

### Rooms Table
- `id` - Auto increment primary key
- `room_key` - Unique room identifier (room1, room2, etc.)
- `title` - Room name/title
- `description` - Room description
- `price_per_night` - Price per night (decimal)
- `image_path` - Path to room image
- `max_guests` - Maximum number of guests

### Events Table
- `id` - Auto increment primary key
- `event_key` - Unique event identifier
- `name` - Event name
- `price` - Event price (decimal)
- `description` - Event description

## Environment Variables

The `.env` file contains:
```env
# Database Configuration
MARIA_ROOT_PASSWORD=admin
MARIA_DATABASE=hotel
MARIA_USER=hoteluser
MARIA_PASSWORD=hoteladmin

# Application Configuration
WEBSERVER_PORT=80

# Database Connection Details for Application
DB_HOST=db
DB_PORT=3306
DB_NAME=hotel
DB_USER=hoteluser
DB_PASSWORD=hoteladmin
```

## API Endpoints

- `GET /api/rooms` - Returns all rooms from database
- `GET /api/events` - Returns all events from database

## Testing Database Connection

Run the database test script:
```bash
node test-db.js
```

## Manual Database Access

Connect to MariaDB directly:
```bash
docker exec -it hotel-maria-db mysql -u hoteluser -p hotel
```

## Troubleshooting

1. **Database connection issues:**
   - Ensure Docker containers are running
   - Check `.env` file configuration
   - Verify database credentials

2. **Data not loading:**
   - Check browser console for API errors
   - Verify database tables exist and contain data
   - Check backend logs for database errors

3. **Reset database:**
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

## Architecture

The application now follows this flow:
1. Frontend loads `/book` page
2. JavaScript calls `/api/rooms` and `/api/events`
3. Backend queries MariaDB database
4. Frontend dynamically creates room cards and event list
5. All pricing is pulled from database in real-time

This allows for easy price updates through database modifications without code changes.
