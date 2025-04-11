const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String },
    phone: { type: String },
});

// Prevent overwriting the model
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;