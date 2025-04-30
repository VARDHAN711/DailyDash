const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Auth middleware
const authenticateToken = require("../middleware/authMiddleware");

// === Static HTML Routes ===
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.get('/home', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'home.html'));
});

router.get('/ordernow', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'ordernow.html'));
});

router.get('/orders', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'orders.html'));
});

router.get('/profile', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'profile.html'));
});

// === Signup Route ===
router.post("/signup", async (req, res) => {
    const { email, password, captcha } = req.body;

    if (!captcha) {
        return res.status(400).json({ message: "reCAPTCHA is required!" });
    }

    try {
        const captchaVerification = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: RECAPTCHA_SECRET_KEY,
                response: captcha
            })
        });

        const captchaData = await captchaVerification.json();
        if (!captchaData.success) {
            return res.status(400).json({ message: "reCAPTCHA verification failed!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // generate the token and return it
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(201).json({ token, message: "Signup successful" });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// === Login Route ===
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password!" });
        }

        // generate the token and return it
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Store user session
        req.session.user = {
            id: user._id,
            email: user.email
        };

        return res.status(200).json({ token, message: "Login successful" });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
