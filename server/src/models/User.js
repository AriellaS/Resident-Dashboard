"use strict"

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Promise = require("bluebird");

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["RESIDENT", "ATTENDING"],
        required: true
    },
    email_confirmed: {
        type: Boolean,
        default: false,
    },
    created_at: Date,
    updated_at: Date,
});

userSchema.pre("save", function(next) {
    let user = this;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword) {
    let password = this.password;
    return new Promise(function(resolve, reject) {
        bcrypt.compare(candidatePassword, password, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        });
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
