"use strict"

const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailUser,
        pass: config.emailPassword
    }
});

const sendVerificationEmail = (recipient, verificationCode) => {
    transporter.sendMail({
        from: config.emailUser,
        to: recipient,
        subject: `Your EvalMD verification code: ${verificationCode}`,
        text: `Your code is ${verificationCode}. Verify your account at https://evalmd.io/verify. If you did not request this code, please ignore this email.`
    }, (err) => { err ? console.log(err) : console.log(`Email sent to ${recipient}`) });
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

const verifyEmailVerif = async (req, res, next) => {
    return res.status(400).end("Email verification is currently disabled");
    /*if (!req.user.email_verified) {
        return res.status(401).end("User email not verified");
    }
    next();*/
}

router.post('/login', async (req, res) => {
    let user = await User.findOne({
        email: req.body.email
    }).select("+password");

    if (!user) {
        return res.status(200).end("User not found");
    }

    let candidatePassword = req.body.password;

    return user.comparePassword(candidatePassword, async (error, isMatch) => {
        if (error || !isMatch) {
            return res.status(200).end("Invalid login credentials");
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
        user: req.user._id
    });
    req.session.destroy((err) => {
        return res.status(500).end("Logout unsuccessful");
    });
    res.end();
});

router.post('/users', async (req, res) => {
    return res.status(400).end("Account creation is currently disabled");
    /*let emailPattern = /^([\w-]+(?:\.[\w-]+)*)@(montefiore\.org|einsteinmed\.edu)$/i;
    let emailIsValid = emailPattern.test(req.body.email);
    if (!emailIsValid) {
        return res.status(400).end("Invalid email");
    }

    if (req.body.password.length < 8) {
        return res.status(400).end("Password requirements not met");
    }

    let role = req.body.role.toUpperCase();
    if (!["RESIDENT","ATTENDING"].includes(role)) {
        return res.status(400).end("Invalid role");
    }

    let userExists = await User.findOne({
        email: req.body.email
    });
    if (userExists) {
        return res.status(200).end("Email is already in use");
    }

    let user;
    let verificationCode = [...Array(6)].map(_=>Math.random()*10|0).join("");
    try {
        user = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            role: role,
            pgy: role === "RESIDENT" ? 1 : null, // make all residents pgy-1 for now
            verification_code: verificationCode
        });
    } catch(err) {
        return res.status(500).end("Unable to create account");
    }

    user.password = undefined;
    user.verification_code = undefined;

    console.log("Account created for " + req.body.firstname);

    sendVerificationEmail(req.body.email, verificationCode);

    let refreshToken = await RefreshToken.createToken(user._id);
    let accessToken = createNewAccessToken(user._id);
    res.cookie('refreshToken', refreshToken);

    return res.send({
        accessToken: accessToken,
        user: user
    });*/
});

router.put('/verify', verifyAccessToken, async (req, res) => {
    return res.status(400).end("Email verification is currently disabled");
    /*let code = req.body.code;
    let user = req.user;
    if (user.email_verified) {
        return res.status(400).end("User is already verified");
    }
    if (code !== user.verification_code) {
        return res.status(200).end("Verification code is incorrect");
    }
    user.email_verified = true;
    user.verification_code = null;
    await user.save()
    return res.status(200).end("User verified");*/
});

router.put('/verify/new', verifyAccessToken, async (req, res) => {
    return res.status(400).end("Email verification is currently disabled");
    /*let user = req.user;
    if (user.email_verified) {
        return res.status(400).end("User is already verified");
    }
    let verificationCode = [...Array(6)].map(_=>Math.random()*10|0).join("");
    user.verification_code = verificationCode;
    await user.save();
    sendVerificationEmail(user.email, verificationCode);

    return res.status(200).end("New code sent");*/
});

router.put('/changepw', verifyAccessToken, async (req, res) => {
    if (req.body.password.length < 8) {
        return res.status(400).end("Password requirements not met");
    }
    let user = await User.findById(req.session.userId).select("+password");
    user.password = req.body.password;
    user.changepw_required = false;
    await user.save();
    user.password = undefined;
    //TODO: send email to user

    return res.status(200).end("Password changed");
});

router.get('/users', verifyAccessToken, async (req, res) => {
    let role = req.query.role;
    if (role != "RESIDENT" && role != "ATTENDING") {
        return res.status(400).end("Invalid role");
    }
    let users = await User.find({
        role: role,
        email_verified: true
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
    let userId;
    try {
        userId = new ObjectId(req.params.userId);
    } catch (err) {
        return res.status(400).end("Invalid user ID");
    }
    if (req.user.role !== "ATTENDING" && !req.user._id.equals(userId)) {
        return res.status(401).end("Unauthorized");
    }
    let user = await User.findById(userId).exec();
    if (!user) {
        res.status(404).end("User not found");
    }
    let evals = await AttendingToResidentEval.find({
        evaluatee: userId,
    });
    res.json(evals);
});

router.post('/users/id/:userId/evals', verifyAccessToken, async (req, res) => {
    let evalType = req.body.type;
    let formObject = req.body.form;
    let evaluateeId = new ObjectId(req.params.userId);

    if (evalType !== "ATTENDING2RESIDENT" && evalType !== "RESIDENT2RESIDENT") {
        return res.status(400).end("Invalid eval type");
    }

    if (req.user._id.equals(evaluateeId)) {
        return res.status(400).end("One cannot evaluate oneself");
    }

    let evaluatee = await User.findById(evaluateeId).select('role');
    if (!evaluatee) {
        return res.status(400).end("User not found");
    }

    let form = [];
    Object.keys(formObject).forEach((key, i) => {
        form[i] = {
            name: key,
            option: formObject[key],
        }
    });

    if (evalType === "ATTENDING2RESIDENT") {
        if (req.user.role !== "ATTENDING") {
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
                evaluator: req.user._id,
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
