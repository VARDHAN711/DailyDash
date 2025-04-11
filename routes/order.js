// routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/order', authenticateToken, async (req, res) => {
    try {
        const { packageId, packageType, pickupAddress, dropAddress, distance, cost } = req.body;
        const userId = req.user.id;

        const newOrder = new Order({
            userId,
            packageId,
            packageType,
            pickupAddress,
            dropAddress,
            distance,
            cost,
            status: "Delivered Successful"
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/orders', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }).sort({ orderedAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

module.exports = router;