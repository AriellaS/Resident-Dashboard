"use strict"

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;
const configPath = path.join(__dirname, '../config.json');
const defaultConfig = {
    secret: "secret",
    accessExpirationSeconds: 60,
    refreshExpirationSeconds: 120,
    dbHost: "localhost",
    dbPort: 27017,
    dbUsername: "",
    dbPassword: "",
    dbName: "ResidentDashboard",
};

// Create config if it does not exist
let config;
if (fs.existsSync(configPath)) {
    console.log("config")
    config = JSON.parse(fs.readFileSync(configPath));
    for (let key in defaultConfig) {
        if (!(key in config)) {
            config[key] = defaultConfig[key];
        }
    }
} else {
    config = defaultConfig;
    console.log("Generated default config.json");
}
fs.writeFileSync(configPath, JSON.stringify(config, null, "\t"))

// Connect to MongoDB
mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`, {
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
    secret: "test123",
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
