"use strict"

const express = require('express');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const ObjectId = require('mongodb').ObjectId;
const RefreshToken = require('./models/RefreshToken');
const config = require('../config');

const router = express.Router();

const createNewAccessToken = (userId) => {
    let accessToken = jwt.sign({
        id: userId,
    }, config.secret, {
        expiresIn: config.accessExpirationSeconds,
    });
    return accessToken;
};

const verifyAccessToken = (req, res, next) => {
    let token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).end("No token provided");
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).end("Access token is expired")
            }
            return res.status(401).end("Unauthorized");
        }
        req.userId = decoded.id;
        next();
    });
};

router.get('/info', verifyAccessToken, (req, res) => {
    res.send("INFO!!");
});

router.post('/login', Promise.coroutine(function*(req, res) {
    let user = yield User.findOne({
        email: req.body.email
    }).select("+password");

    if (!user) {
        return res.status(400).end("Invalid login credentials");
    }

    let candidatePassword = req.body.password;
    let passwordsMatch = yield user.comparePassword(candidatePassword);

    if (!passwordsMatch) {
        return res.status(400).end("Invalid login credentials");
    }

    delete user.password;

    let refreshToken = yield RefreshToken.createToken(user._id);
    res.cookie('refreshToken', refreshToken);

    let accessToken = createNewAccessToken(user._id);
    return res.status(200).send({
        accessToken: accessToken,
    });

}));

router.post('/refresh', Promise.coroutine(function*(req, res) {
    let refreshTokenString = req.cookies.refreshToken;
    let refreshToken = yield RefreshToken.findOne({
        token: refreshTokenString,
    });
    if (!refreshToken) {
        res.status(400).end("Invalid refresh token");
    }
    if (!refreshToken.verifyExpiration) {
        res.status(400).end("Refresh token is expired");
    }
    let accessToken = createNewAccessToken(refreshToken.user._id);
    res.status(200).send({
        accessToken: accessToken,
    });
}));

router.post('/logout', Promise.coroutine(function*(req, res) {
    yield RefreshToken.deleteMany({
        user: req.userId
    });
    res.end();
}));

router.post('/users', Promise.coroutine(function*(req, res) {
    let emailPattern = /^([\w-]+(?:\.[\w-]+)*)@(montefiore\.org|einsteinmed\.edu)$/i;
    let emailIsValid = emailPattern.test(req.body.email);
    if (!emailIsValid) {
        return res.status(400).end("Invalid email");
    }

    let userExists = yield User.findOne({
        email: req.body.email
    });
    if (userExists) {
        return res.status(400).end("Email is already in use");
    }

    let user;
    try {
        user = yield User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role.toUpperCase(),
        });
    } catch(err) {
        return res.status(500).end("Unable to create account");
    }

    console.log("Account created for " + req.body.firstname);

    let refreshToken = yield RefreshToken.createToken(user._id);
    res.cookie('refreshToken', refreshToken);

    let accessToken = createNewAccessToken(user._id);
    return res.send({
        accessToken: accessToken,
    });
}));

router.get('/users/id/:userId', verifyAccessToken, Promise.coroutine(function*(req, res) {
    let userId = new ObjectId(req.params.userId);
    let user = yield User.findById(userId).exec();
    if (!user) {
        res.status(404).end("User not found");
    }
    res.json(user);
}));

router.post('/evals', verifyAccessToken, Promise.coroutine(function*(req, res) {
    let evalType = req.body.type;
    let evaluator = req.params.userId;
    let evaluatee = req.body.evaluatee;
    if (evalType === "ATTENDING2RESIDENT") {
    } else {
        res.status(400).end("Invalid eval type");
    }

    // check if eval type is valid
    // check if user exists
    // check if evaluatee exists
    // check if evaluator is attending,evaluatee is resident
    // create eval
}));

module.exports = router;
