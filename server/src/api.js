"use strict"

const express = require('express');
const Promise = require('bluebird');
const session = require('express-session');
const User = require('./models/User.js');

const router = express.Router();

router.get('/info', (req, res) => {
    res.send("INFO!!");
});

router.post('/login', Promise.coroutine(function*(req, res) {
    let user = yield User.findOne({
        email: req.body.email
    }).select("+password");

    if (!user) {
        return res.status(400).end("Invalid login credentials.");
    }

    let candidatePassword = req.body.password;
    let passwordsMatch = yield user.comparePassword(candidatePassword);

    if (!passwordsMatch) {
        return res.status(400).end("Invalid login credentials.");
    }

    delete user.password;

    req.session.userId = user._id;
    console.log(req.body.email + " has logged in.");

    res.send({
        token: 'test123'
    });

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
            password: req.body.password
        });
    } catch(err) {
        console.log(err);
        return res.status(400).end("Invalid user info");
    }

    req.session.userId = user._id;
    console.log("Account created for " + req.body.firstname);

    res.send({
        token: 'test123'
    });
}));

module.exports = router;
