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
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/", async (req, res) => {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to DB
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
});

app.listen(port, () => {
    console.log(`\nServer is running in http://localhost:${port}`);
})
