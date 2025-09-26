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

const app = express();
//const port = process.env.PORT || 8080;
const port = 8080;
const configPath = path.join(__dirname, '../config.json');
const defaultConfig = {
    secret: "secret",
    accessExpirationSeconds: 12000,
    refreshExpirationSeconds: 43200,
    dbHost: "localhost",
    dbPort: 27017,
    dbUsername: "test",
    dbPassword: "test",
    dbName: "ResidentDashboard",
};
const isProduction = process.env.NODE_ENV==='production';
console.log(`Environemnt: ${process.env.NODE_ENV}`);

let config;
if (isProduction) {
    if (fs.existsSync(configPath)) {
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
} else {
    config = defaultConfig
}

// Connect to MongoDB
mongoose.connect(`mongodb${isProduction?`+srv`:``}://${config.dbUsername}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`, {
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

app.use(async (req, res, next) => {
    if (req.session && req.session.userId) {
        let user = await User.findById(req.session.userId);
        req.user = user;
    }
    next();
});

// API
const api = require('./api');
app.use("/api", api);

// Listen
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
