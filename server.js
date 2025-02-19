const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const RECAPTCHA_SECRET_KEY = "6Leq59oqAAAAAKetJ7abtjKwdfoSyNnigZapfau2"; // Replace with your actual secret key


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
    const { email, password, captcha } = req.body;

    if (!captcha) {
        return res.status(400).json({ message: "reCAPTCHA is required!" });
    }

    try {
        // ✅ Verify reCAPTCHA with Google
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
            console.error("❌ reCAPTCHA failed:", captchaData);
            return res.status(400).json({ message: "reCAPTCHA verification failed!" });
        }

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // ✅ Hash the password and save the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Signup successful!" });

    } catch (error) {
        console.error("🔥 Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Login Route
app.post("/login", async (req, res) => {
    const { email, password, captcha } = req.body;

    // Verify reCAPTCHA with Google
    if (!captcha) {
        return res.status(400).json({ message: "reCAPTCHA is required!" });
    }

    try {
        const captchaVerification = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captcha}`,
        });

        const captchaData = await captchaVerification.json();

        if (!captchaData.success) {
            return res.status(400).json({ message: "reCAPTCHA verification failed!" });
        }

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

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.listen(port, () => {
    console.log(`\nServer is running in http://localhost:${port}`);
})
