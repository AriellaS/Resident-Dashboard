"use strict"

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config');

const refreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: config.refreshExpirationSeconds
    },
});

refreshTokenSchema.statics.createToken = async function (userId) {
    let _token = uuidv4();

    let _object = new this({
        token: _token,
        user: userId,
    });

    let refreshToken = await _object.save();
    return refreshToken.token;
};

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
