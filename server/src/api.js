"use strict"

const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const OpenAi = require('openai');
const User = require('./models/User');
const AttendingToResidentEval = require('./models/AttendingToResidentEval');
const ObjectId = require('mongodb').ObjectId;
const RefreshToken = require('./models/RefreshToken');
const util = require('./util.js');

const config = util.getConfig();

const router = express.Router();

const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
    }, (err) => { err ? console.log("Error sending email") : console.log(`Email sent to ${recipient}`) });
};

const createNewAccessToken = (userId) => {
    let accessToken = jwt.sign({
        id: userId,
    }, config.secret, {
        expiresIn: config.accessExpirationSeconds,
    });
    return accessToken;
};

const verifyAccessToken = async (req, res, next) => {
    let token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).end("No token provided");
    }
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).end("Access token is expired")
            }
            return res.status(401).end("Unauthorized");
        }
        let user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).end("User not found");
        }
        req.user = user;
        next();
    });
};

const verifyAccount = async (req, res, next) => {
    if (!req.user.account_verified) {
        return res.status(401).end("User not verified");
    }
    next();
}

router.post('/refresh', async (req, res) => {
    let refreshTokenString = req.cookies.refreshToken;
    let refreshToken = await RefreshToken.findOne({
        token: refreshTokenString,
    });
    if (!refreshToken) {
        return res.status(400).end("Refresh token is invalid or expired");
    }
    let accessToken = createNewAccessToken(refreshToken.user._id);
    res.status(200).send({
        accessToken: accessToken,
    });
});

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

        res.cookie('refreshToken', refreshToken, {
            maxAge: config.refreshExpirationSeconds * 1000,
            secure: util.isProduction,
        });

        return res.status(200).send({
            accessToken: accessToken,
            user: user
        });

    });
});

router.post('/logout', async (req, res) => {
    await RefreshToken.deleteOne({
        token: req.cookies.refreshToken,
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

    let verificationCode = [...Array(6)].map(_=>Math.random()*10|0).join("");
    let user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role: role,
        pgy: role === "RESIDENT" ? req.body.pgy : null,
        verification_code: verificationCode
    });
    if (!user) {
        return res.status(500).end("Unable to create account");
    }

    user.password = undefined;
    user.verification_code = undefined;

    console.log("Account created for " + req.body.firstname);

    //sendVerificationEmail(req.body.email, verificationCode);

    let refreshToken = await RefreshToken.createToken(user._id);
    let accessToken = createNewAccessToken(user._id);
    res.cookie('refreshToken', refreshToken, {
        maxAge: config.refreshExpirationSeconds * 1000,
        secure: util.isProduction,
    });

    return res.send({
        accessToken: accessToken,
        user: user
    });
});

router.put('/verify', verifyAccessToken, async (req, res) => {
    let code = req.body.code;
    let user = await User.findById(req.user._id).select("+verification_code");
    if (user.account_verified) {
        return res.status(400).end("User is already verified");
    }
    if (code !== user.verification_code) {
        return res.status(200).end("Verification code is incorrect");
    }
    user.account_verified = true;
    user.verification_code = null;
    await user.save()
    return res.status(200).end("User verified");
});

router.put('/verify/new', verifyAccessToken, async (req, res) => {
    let user = req.user;
    if (user.account_verified) {
        return res.status(400).end("User is already verified");
    }
    let verificationCode = [...Array(6)].map(_=>Math.random()*10|0).join("");
    user.verification_code = verificationCode;
    await user.save();
    //sendVerificationEmail(user.email, verificationCode);

    return res.status(200).end("New verification code created");
});

router.put('/changepw', verifyAccessToken, verifyAccount, async (req, res) => {
    if (req.body.password.length < 8) {
        return res.status(400).end("Password requirements not met");
    }
    let user = await User.findById(req.user._id).select("+password");
    user.password = req.body.password;
    user.changepw_required = false;
    await user.save();
    await RefreshToken.deleteMany({
        user: req.user._id,
        token: { $ne: req.cookies.refreshToken }
    });
    //TODO: send email to user

    return res.status(200).end("Password changed");
});

router.get('/users', verifyAccessToken, verifyAccount, async (req, res) => {
    let role = req.query.role;
    if (role != "RESIDENT" && role != "ATTENDING") {
        return res.status(400).end("Invalid role");
    }
    let users = await User.find({
        role: role,
    }).select('firstname lastname role pgy');
    res.json(users);
});

router.get('/users/id/:userId', verifyAccessToken, verifyAccount, async (req, res) => {
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

router.get('/users/id/:userId/evals', verifyAccessToken, verifyAccount, async (req, res) => {
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
    res.json({ evals: evals, user: user });
});

router.post('/users/id/:userId/evals/aisummary', verifyAccessToken, verifyAccount, async (req, res) => {
    let userId;
    let questionSchema = req.body.questionSchema;

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

    let condensedEvals = evals.map(({ form }) => form.reduce((acc, { name, option }) => {
        if (option !== null && option !== "") acc[name] = option;
        return acc;
    }, {}));

    let prompt = `You are summarizing a surgical resident’s performance based on attending evaluations.

Resident feedback data:
${JSON.stringify(condensedEvals)}

Question schema (defines the meaning of each response and any option labels):
${JSON.stringify(questionSchema)}

Write a concise narrative summary of the resident’s overall performance, highlighting key strengths and areas for improvement. Do not mention question identifiers or field names in the response. Ignore any data that does not appear in the question schema. Limit the response to a maximum of four sentences.`

    let openAIResponse;
    try {
        openAIResponse = await client.responses.create({
            model: 'gpt-5-nano',
            input: prompt
        });
    } catch(err) {
        return res.status(500).end("Error requesting AI summary");
    }

    return res.status(200).send({
        aiSummary: openAIResponse.output_text
    });

});

router.post('/users/id/:userId/evals', verifyAccessToken, verifyAccount, async (req, res) => {
    let evalType = req.body.type;
    let formObject = req.body.form;
    let evaluateeId = new ObjectId(req.params.userId);

    if (evalType !== "ATTENDING2RESIDENT" && evalType !== "RESIDENT2RESIDENT") {
        return res.status(400).end("Invalid eval type");
    }

    if (req.user._id.equals(evaluateeId)) {
        return res.status(400).end("One cannot evaluate oneself");
    }

    let evaluatee = await User.findById(evaluateeId).select('role account_verified');
    if (!evaluatee) {
        return res.status(400).end("Evaluatee not found");
    }
    if (!evaluatee.account_verified) {
        return res.status(400).end("Evaluatee not verified");
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
            let evaluation = await AttendingToResidentEval.create({
                evaluator: req.user._id,
                evaluatee: evaluateeId,
                form,
            });
        } catch(err) {
            return res.status(500).end("Unable to submit eval");
        }
    }

    if (evalType === "RESIDENT2RESIDENT") {
            //eventually
    }

    return res.status(200).end("Eval submitted");;
});


module.exports = router;

