"use strict"

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8080;
const dbname = 'ENTResidentDashboard';

const api = require('./api');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(`mongodb://localhost:27017/${dbname}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(session({
    secret: "test123",
    resave: false,
    cookie: {
        secure: false,
        maxAge: 60000
    }
}));

// API
app.use("/api", api);

// Listen
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
