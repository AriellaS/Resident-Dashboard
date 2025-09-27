"use strict"

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const User = require('./models/User');
const util = require('./util');

const config = util.getConfig();
const app = express();
const port = 8080;
console.log(`Environment: ${process.env.NODE_ENV}`);

// Connect to MongoDB
mongoose.connect(`mongodb${util.isProduction?`+srv`:``}://${config.dbUsername}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: config.secret,
    resave: false,
    cookie: {
        secure: false,
        maxAge: 60000
    }
}));

// API
const api = require('./api');
app.use("/api", api);

// Listen
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
