const express = require('express');
const router = express.Router();
const path = require('path');

// Define routes for static pages
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});







// Export the router to use in app.js
module.exports = router;