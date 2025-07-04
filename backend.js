// Load environment variables
require('dotenv').config();

const mariadb = require("mariadb");
const express = require("express");
const app = express();
const redis = require("redis");
const layout = require("express-ejs-layouts");

// Database connection pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'hoteluser',
    password: process.env.DB_PASSWORD || 'hoteladmin',
    database: process.env.DB_NAME || 'hotel',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    multipleStatements: false
});

// Test database connection on startup with retry logic
async function testDbConnection(retries = 5) {
    let conn;
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting database connection (attempt ${i + 1}/${retries})...`);
            conn = await pool.getConnection();
            console.log('✅ Connected to MariaDB successfully!');
            const result = await conn.query("SELECT 1 as test");
            console.log('✅ Database test query successful');
            
            // Test if our tables exist
            const tables = await conn.query("SHOW TABLES");
            console.log('📊 Available tables:', tables.map(t => Object.values(t)[0]));
            
            return true;
        } catch (err) {
            console.error(`❌ Database connection attempt ${i + 1} failed:`, err.message);
            if (i < retries - 1) {
                console.log(`⏳ Retrying in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        } finally {
            if (conn) conn.end();
        }
    }
    console.error('❌ All database connection attempts failed. Continuing without database...');
    return false;
}

// Test connection when server starts
testDbConnection();

app.use(layout);
app.set("layout", "mainLayout.ejs");

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("home.ejs", {
    });
});

app.get("/book", function (req, res) {
    res.render("book.ejs", {
    });
});

app.get("/spa", function (req, res) {
    res.render("spa.ejs", {
    });
});

app.get("/experiences", function (req, res) {
    res.render("experiences.ejs", {
    });
});

app.get("/dining", function (req, res) {
    res.render("dining.ejs", {
    });
});

app.get("/rooms", function (req, res) {
    res.render("rooms.ejs", {
    });
});

app.get("/about", function (req, res) {
    res.render("about.ejs", {
    });
});

// API endpoint to get room data from database
app.get("/api/rooms", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM rooms ORDER BY price_per_night ASC");
        console.log(`📊 Fetched ${rows.length} rooms from database`);
        res.json(rows);
    } catch (err) {
        console.error("Database error fetching rooms:", err.message);
        // Return fallback data if database fails
        const fallbackRooms = [
            { room_key: 'room1', title: 'SUNRISE BEACH VILLA', description: 'Cozy single room with sea view, queen bed, ensuite bathroom.', price_per_night: 120, image_path: '/images/room1.jpg' },
            { room_key: 'room2', title: 'LUNA LAGOON VILLA', description: 'Spacious double room, balcony, king bed, modern amenities.', price_per_night: 140, image_path: '/images/room2.jpg' },
            { room_key: 'room3', title: 'OCEAN EMBER RESIDENCE', description: 'Deluxe suite, living area, oceanfront, luxury bath.', price_per_night: 160, image_path: '/images/room3.jpg' },
            { room_key: 'room4', title: 'AZURE HAVEN RETREAT', description: 'Family room, two double beds, garden view, kids welcome.', price_per_night: 180, image_path: '/images/room4.jpg' },
            { room_key: 'room5', title: 'EMERALD FAMILY BEACH VILLA', description: 'Executive suite, workspace, lounge, premium comfort.', price_per_night: 200, image_path: '/images/room5.jpg' },
            { room_key: 'room6', title: 'CORAL HORIZON SUITE', description: 'Penthouse, panoramic view, private terrace, luxury amenities.', price_per_night: 220, image_path: '/images/room6.jpg' },
            { room_key: 'room7', title: 'THE ELYSIAN PRIVATE ISLAND', description: 'Villa, private pool, kitchen, exclusive retreat.', price_per_night: 250, image_path: '/images/private4.jpg' }
        ];
        console.log('📊 Using fallback room data');
        res.json(fallbackRooms);
    } finally {
        if (conn) conn.end();
    }
});

// API endpoint to get event data from database
app.get("/api/events", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM events ORDER BY price ASC");
        console.log(`🎉 Fetched ${rows.length} events from database`);
        res.json(rows);
    } catch (err) {
        console.error("Database error fetching events:", err.message);
        // Return fallback data if database fails
        const fallbackEvents = [
            { event_key: 'wedding', name: 'Wedding', price: 2000, description: 'Complete wedding ceremony package' },
            { event_key: 'yacht', name: 'Yacht', price: 500, description: 'Private yacht experience' },
            { event_key: 'massage', name: 'Massage', price: 80, description: 'Relaxing spa massage' },
            { event_key: 'snorkeling', name: 'Snorkeling', price: 120, description: 'Underwater adventure tour' }
        ];
        console.log('🎉 Using fallback event data');
        res.json(fallbackEvents);
    } finally {
        if (conn) conn.end();
    }
});

// Redis client setup
const redisClient = redis.createClient({ url: 'redis://redis:6379' });
redisClient.connect().catch(console.error);

// Route to save booking (AJAX POST from book.ejs)
app.post('/save-booking', express.json(), async (req, res) => {
    const booking = req.body;
    await redisClient.set('booking:local', JSON.stringify(booking));
    res.json({ success: true });
});

// Route to show shop.ejs with booking summary and contact form
app.get('/shop', async (req, res) => {
    const bookingStr = await redisClient.get('booking:local');
    let booking = {};
    if (bookingStr) {
        booking = JSON.parse(bookingStr);
    }
    res.render('shop.ejs', { booking });
});

// Route to handle "Buy now" (save contact info, etc.)
app.post('/buy', express.urlencoded({ extended: true }), async (req, res) => {
    // Here you could save the contact info and booking to a database or send an email
    // For now, just show a confirmation
    res.send('<h2>Thank you for your booking!</h2><a href="/">Back to Home</a>');
});

app.post('/delete-booking', async (req, res) => {
    await redisClient.del('booking:local');
    res.json({ success: true });
});


app.get('/shop-badge', async (req, res) => {
    const bookingStr = await redisClient.get('booking:local');
    res.json({ hasBooking: !!bookingStr });
});

app.listen(80);
console.log("App listening on port http://localhost:80");