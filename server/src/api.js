"use strict"

const express = require('express');
const jwt = require('jsonwebtoken');
const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const bcrypt = require('bcryptjs');
const OpenAI = require('openai');
const User = require('./models/User');
const FacultyToResidentEval = require('./models/FacultyToResidentEval');
const EvalRequest = require('./models/EvalRequest');
const ObjectId = require('mongodb').ObjectId;
const RefreshToken = require('./models/RefreshToken');
const util = require('./util.js');

const config = util.getConfig();
const router = express.Router();

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
});

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

const sendPasswordResetEmail = async (user, token) => {
    const data = await mg.messages.create("evalmd.io", {
        from: "EvalMD <noreply@evalmd.io>",
        to: util.isProduction ? [`${user.firstname} ${user.lastname} <${user.email}>`] : [`<ariella.simoni@einsteinmed.edu>`],
        subject: "Password Reset",
        text: `Password Reset`,
        html: `<p>Hi ${user.firstname} ${user.lastname}, we saw that you were having trouble logging in!</p><p>Click here to reset your password: <a href="https://evalmd.io/changepw/token/${token}">https://evalmd.io/changepw/token/${token}</a></p><p>If you did not request a password reset, kindly ignore this email. Thank you for using EvalMD!</p>`,
    });
    console.log(data);
};

const sendPasswordChangedEmail = async(user) => {
    const data = await mg.messages.create("evalmd.io", {
        from: "EvalMD <noreply@evalmd.io>",
        to: util.isProduction ? [`${user.firstname} ${user.lastname} <${user.email}>`] : [`<ariella.simoni@einsteinmed.edu>`],
        subject: "Password Changed",
        text: `Password Changed`,
        html: `<p>Your password has been updated.</p><p>If this wasn't you, please contact us!</p>`,
    });
    console.log(data);
}

const sendEvalRequestEmail = async (evaluator, evaluatee, note) => {
    const data = await mg.messages.create("evalmd.io", {
        from: "EvalMD <noreply@evalmd.io>",
        to: util.isProduction ? [`${evaluator.firstname} ${evaluator.lastname} <${evaluator.email}>`] : [`<ariella.simoni@einsteinmed.edu>`],
        subject: `Evaluation Request from ${evaluatee.firstname} ${evaluatee.lastname}`,
        text: `Evaluation request`,
        html: `<p>You have a new evaluation request from ${evaluatee.firstname} ${evaluatee.lastname}.</p><p>They provided the following note: ${note}</p><p>Click here to submit your feedback: <a href="https://evalmd.io/users/${evaluatee._id}">https://evalmd.io/users/${evaluatee._id}</a></p>`
    });
    console.log(data);
}

const requestAIReport = async(condensedEvals, questionSchema) => {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `You are summarizing a surgical resident’s performance based on attending evaluations.

Resident feedback data:
${JSON.stringify(condensedEvals)}

Question schema (defines the meaning of each response and any option labels):
${JSON.stringify(questionSchema)}

Write a concise narrative summary of the resident’s overall performance, highlighting key strengths and areas for improvement. Do not mention question identifiers or field names in the response. Ignore any data that does not appear in the question schema. Limit the response to a maximum of four sentences.`;

    const response = await client.responses.create({
        model: "gpt-5-nano",
        input: prompt
    });

    return response.output_text;
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
        email: req.body.email.toLowerCase()
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
    let emailPattern = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
    let emailIsValid = emailPattern.test(req.body.email);
    if (!emailIsValid) {
        return res.status(400).end("Invalid email");
    }

    if (req.body.password.length < 8) {
        return res.status(400).end("Password requirements not met");
    }

    let role = req.body.role.toUpperCase();
    if (!["RESIDENT","FACULTY"].includes(role)) {
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
        email: req.body.email.toLowerCase(),
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

    return res.status(200).end("New verification code created");
});

router.put('/forgotpw', async (req, res) => {
    let user = await User.findOne({
        email: req.body.email.toLowerCase()
    })
    if (!user) {
        return res.status(200).end("User not found");
    }
    let token = jwt.sign({
        id: user._id,
    }, config.secret, {
        expiresIn: config.pwResetExpirationSeconds,
    });
    try {
        sendPasswordResetEmail(user, token);
    } catch (err) {
        console.log(err);
        return res.status(500).end("Failed to send reset password email");
    }
    return res.status(200).end("Password reset link sent");
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
    sendPasswordChangedEmail(user);

    return res.status(200).end("Password changed");
});

router.put('/changepw/token/:token', async (req, res) => {
    let token = req.params.token;
    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).end("Reset password token is expired")
            }
            console.log(err)
            return res.status(401).end("Invalid reset password token");
        }
        let user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).end("User not found");
        }
        req.user = user;
        if (req.body.password.length < 8) {
            return res.status(400).end("Password requirements not met");
        }
        // TODO: expire the token after use

        user.password = req.body.password;
        await user.save();
        await RefreshToken.deleteMany({
            user: req.user._id,
            token: { $ne: req.cookies.refreshToken }
        });
        user.password = undefined;
        sendPasswordChangedEmail(user);

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

router.get('/users', verifyAccessToken, verifyAccount, async (req, res) => {
    let role = req.query.role;
    if (role != "RESIDENT" && role != "FACULTY" && role != "ALUM") {
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
    if (req.user.role !== "FACULTY" && !req.user._id.equals(userId)) {
        return res.status(401).end("Unauthorized");
    }
    let user = await User.findById(userId).exec();
    if (!user) {
        res.status(404).end("User not found");
    }
    let evals = await FacultyToResidentEval.find({
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
    if (req.user.role !== "FACULTY" && !req.user._id.equals(userId)) {
        return res.status(401).end("Unauthorized");
    }
    let user = await User.findById(userId).exec();
    if (!user) {
        res.status(404).end("User not found");
    }
    let evals = await FacultyToResidentEval.find({
        evaluatee: userId,
    });

    let condensedEvals = evals.map(({ form }) => form.reduce((acc, { name, option }) => {
        if (option !== null && option !== "") acc[name] = option;
        return acc;
    }, {}));

    let aiSummary;
    try {
        aiSummary = await requestAIReport(condensedEvals, questionSchema);
    } catch(err) {
        console.log(err);
        return res.status(500).end("Error requesting AI summary");
    }

    return res.status(200).send({ aiSummary });

});

router.post('/users/id/:userId/evals', verifyAccessToken, verifyAccount, async (req, res) => {
    let evalType = req.body.type;
    let formObject = req.body.form;
    let evaluateeId = new ObjectId(req.params.userId);

    if (evalType !== "FACULTY2RESIDENT") {
        return res.status(400).end("Invalid eval type");
    }

    if (req.user._id.equals(evaluateeId)) {
        return res.status(400).end("One cannot evaluate oneself");
    }

    let evaluatee = await User.findById(evaluateeId).select('role pgy account_verified');
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

    if (evalType === "FACULTY2RESIDENT") {
        if (req.user.role !== "FACULTY") {
            return res.status(400).end("Evaluator must be faculty");
        }
        if (evaluatee.role !== "RESIDENT") {
            return res.status(400).end("Evaluatee must be a resident");
        }
        if (!FacultyToResidentEval.validateInput(form)) {
            return res.status(400).end("Invalid input");
        }
        try {
            let evaluation = await FacultyToResidentEval.create({
                evaluator: req.user._id,
                evaluatee: evaluateeId,
                pgy: evaluatee.pgy,
                form,
            });
            // TODO: right now this arbitrarily chooses one matching evalrequest to mark as completed, eventually want evals linked to specific requests
            let evalRequest = await EvalRequest.findOne({
                evaluator: req.user._id,
                evaluatee: evaluateeId,
                complete: false,
            });
            if (evalRequest) {
                evalRequest.complete = true;
                await evalRequest.save();
            }
        } catch(err) {
            return res.status(500).end("Unable to submit eval");
        }
    }

    return res.status(200).end("Eval submitted");;
});

router.post('/users/id/:userId/evalrequest', verifyAccessToken, verifyAccount, async (req, res) => {
    let evaluatorId = new ObjectId(req.params.userId);
    let evaluator = await User.findById(evaluatorId).select('role');
    let note = req.body.note;
    if (!evaluator) {
        return res.status(400).end("Evaluator not found");
    }
    if (evaluator.role !== "FACULTY") {
        return res.status(400).end("Evaluator must be faculty");
    }
    if (req.user.role !== "RESIDENT") {
        return res.status(400).end("Evaluatee must be a resident");
    }
    try {
        let evalRequest = await EvalRequest.create({
            evaluator: evaluatorId,
            evaluatee: req.user._id,
            note,
        });
        sendEvalRequestEmail(evaluator, req.user, note);
    } catch(err) {
        return res.status(500).end("Unable to request eval");
    }
    return res.status(200).end("Eval requested");;
});

module.exports = router;

