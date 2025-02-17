const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const bcrypt = require("bcryptjs");


const port = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Import routes from router.js
const pageRoutes = require('./routes/router');

// Use the imported routes
app.use('/', pageRoutes);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

// User Schema
const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists!" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Email not found!" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password!" });
    }

    res.status(200).json({ message: "Login successful!" });
});
app.listen(port, () => {
    console.log(`\nServer is running in http://localhost:${port}`);
})
