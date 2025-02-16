const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;




app.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`);
})
