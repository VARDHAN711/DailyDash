const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");

const port = 3000;
const app = express();

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/DailyDash", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// MongoDB Session Store
const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017/DailyDash",
    collection: "sessions"
});

// Express session middleware
app.use(session({
    secret: "supersecretkey", // change this to a strong random string
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));

// Use Routes
const pageRoutes = require('./routes/router');
app.use('/', pageRoutes);

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at: http://localhost:${port}`);
});
