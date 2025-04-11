const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticateToken = require("../middleware/authMiddleware");
const User = require("../models/user");

// GET user profile
router.get("/", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // Use JWT userId
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            email: user.email,
            username: user.username || "",
            phone: user.phone || ""
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE user profile
router.put("/", authenticateToken, async (req, res) => {
    try {
        const { email, username, phone, password } = req.body;
        const user = await User.findById(req.user.userId); // Use JWT userId
        if (!user) return res.status(404).json({ message: "User not found" });

        user.email = email || user.email;
        user.username = username || user.username;
        user.phone = phone || user.phone;

        if (password && password.length >= 8) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
