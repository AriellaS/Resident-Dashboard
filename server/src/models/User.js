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
    pgy: {
        type: Number,
    },
    verification_code: {
        type: String,
        select: false
    },
    account_verified: {
        type: Boolean,
        default: false,
    },
    changepw_required: {
        type: Boolean,
        default: true,
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

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    let password = this.password;
    bcrypt.compare(candidatePassword, password, (err, isMatch) => {
        if (err) {
            return callback(err, false);
        }
        return callback(null, isMatch)
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
