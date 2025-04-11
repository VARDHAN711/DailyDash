const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    packageId: String,
    packageType: String,
    pickupAddress: String,
    dropAddress: String,
    distance: Number,
    cost: Number,
    status: { type: String, default: 'Delivered' },
    orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
