const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const port = 3000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Import routes from router.js
const pageRoutes = require('./routes/router');

// Use the imported routes
app.use('/', pageRoutes);

app.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`);
})
