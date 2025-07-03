const mysql = require("mariadb");
const express = require("express");
const app = express();
const redis = require("redis");
const layout = require("express-ejs-layouts");

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