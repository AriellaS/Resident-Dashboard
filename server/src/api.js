"use strict"

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const AttendingToResidentEval = require('./models/AttendingToResidentEval');
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
        req.session.userId = decoded.id;
        next();
    });
};

router.post('/login', async (req, res) => {
    let user = await User.findOne({
        email: req.body.email
    }).select("+password");

    if (!user) {
        return res.status(400).end("Invalid login credentials");
    }

    let candidatePassword = req.body.password;
    let passwordsMatch = await user.comparePassword(candidatePassword);

    if (!passwordsMatch) {
        return res.status(400).end("Invalid login credentials");
    }

    user.password = undefined;

    let refreshToken = await RefreshToken.createToken(user._id);
    let accessToken = createNewAccessToken(user._id);

    res.cookie('refreshToken', refreshToken);

    return res.status(200).send({
        accessToken: accessToken,
        user: user
    });

});

router.post('/refresh', async (req, res) => {
    let refreshTokenString = req.cookies.refreshToken;
    let refreshToken = await RefreshToken.findOne({
        token: refreshTokenString,
    });
    if (!refreshToken) {
        return res.status(400).end("Invalid refresh token");
    }
    if (!refreshToken.verifyExpiration) {
        return res.status(400).end("Refresh token is expired");
    }
    let accessToken = createNewAccessToken(refreshToken.user._id);
    res.status(200).send({
        accessToken: accessToken,
    });
});

router.post('/logout', async (req, res) => {
    await RefreshToken.deleteMany({
        user: req.session.userId
    });
    req.session.destroy((err) => {
        return res.status(500).end("Logout unsuccessful");
    });
    res.end();
});

router.post('/users', async (req, res) => {
    let emailPattern = /^([\w-]+(?:\.[\w-]+)*)@(montefiore\.org|einsteinmed\.edu)$/i;
    let emailIsValid = emailPattern.test(req.body.email);
    if (!emailIsValid) {
        return res.status(400).end("Invalid email");
    }

    let userExists = await User.findOne({
        email: req.body.email
    });
    if (userExists) {
        return res.status(400).end("Email is already in use");
    }

    let user;
    try {
        user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role.toUpperCase(),
        });
    } catch(err) {
        return res.status(500).end("Unable to create account");
    }

    user.password = undefined;

    console.log("Account created for " + req.body.firstname);

    let refreshToken = await RefreshToken.createToken(user._id);
    let accessToken = createNewAccessToken(user._id);

    res.cookie('refreshToken', refreshToken);

    return res.send({
        accessToken: accessToken,
        user: user
    });
});

router.get('/users', verifyAccessToken, async (req, res) => {
    let role = req.query.role;
    if (role != "RESIDENT" && role != "ATTENDING") {
        return res.status(400).end("Invalid role");
    }
    let users = await User.find({
        role: "RESIDENT",
    }).select('firstname lastname role');
    res.json(users);
});

router.get('/users/id/:userId', verifyAccessToken, async (req, res) => {
    let userId;
    try {
        userId = new ObjectId(req.params.userId);
    } catch (err) {
        return res.status(400).end("Invalid user ID");
    }
    let user = await User.findById(userId).exec();
    if (!user) {
        return res.status(404).end("User not found");
    }
    res.json(user);
});

router.get('/users/id/:userId/evals', verifyAccessToken, async (req, res) => {
    //TODO check that user accessing is an attending
    let userId = new ObjectId(req.params.userId);
    let user = await User.findById(userId).exec();
    if (!user) {
        res.status(404).end("User not found");
    }
    let evals = await AttendingToResidentEval.find({
        evaluatee: userId,
    });
    res.json(evals);
});

router.post('/evals', verifyAccessToken, async (req, res) => {
    // TODO redo this so that its post /users/id/:userId/evals where useId is the evaluatee
    let evalType = req.body.type;
    let evaluatorId = new ObjectId(req.session.userId);
    let evaluateeId = new ObjectId(req.body.evaluatee);

    let formObject = req.body.form;
    let form = [];
    Object.keys(formObject).forEach((key, i) => {
        form[i] = {
            name: key,
            option: formObject[key],
        }
    });

    if (evaluatorId.equals(evaluateeId)) {
        return res.status(400).end("One cannot evaluate oneself");
    }

    let evaluator = await User.findById(evaluatorId).select('role');
    let evaluatee = await User.findById(evaluateeId).select('role');

    if (!evaluator || !evaluatee) {
        return res.status(400).end("User not found");
    }

    if (evalType !== "ATTENDING2RESIDENT" && evalType !== "RESIDENT2RESIDENT") {
        return res.status(400).end("Invalid eval type");
    }

    if (evalType === "ATTENDING2RESIDENT") {
        if (evaluator.role !== "ATTENDING") {
            return res.status(400).end("Evaluator must be an attending");
        }
        if (evaluatee.role !== "RESIDENT") {
            return res.status(400).end("Evaluatee must be a resident");
        }
        if (!AttendingToResidentEval.validateInput(form)) {
            return res.status(400).end("Invalid input");
        }
        try {
            await AttendingToResidentEval.create({
                evaluator: evaluatorId,
                evaluatee: evaluateeId,
                form,
            });
        } catch(err) {
            console.log(err)
            return res.status(500).end(err);
        }
    }

    if (evalType === "RESIDENT2RESIDENT") {
            //eventually
    }

    console.log('Eval submitted');
    return res.status(200).end("Eval submitted");;
});

module.exports = router;
