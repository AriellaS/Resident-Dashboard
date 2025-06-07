"use strict"

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    verification_code: {
        type: String,
        select: false
    },
    email_verified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

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
    return async (resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        });
    };
};

const User = mongoose.model("User", userSchema);

module.exports = User;
