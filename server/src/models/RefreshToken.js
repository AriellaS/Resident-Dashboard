"use strict"

const mongoose = require('mongoose');
const Promise = require('bluebird');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config');

const refreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    expiryDate: Date,
});

refreshTokenSchema.statics.createToken = Promise.coroutine(function*(userId) {
    let expiredAt = new Date();

    expiredAt.setSeconds(
        expiredAt.getSeconds() + config.refreshExpirationSeconds
    );

    let _token = uuidv4();

    let _object = new this({
        token: _token,
        user: userId,
        expiryDate: expiredAt.getTime(),
    });

    let refreshToken = yield _object.save();
    return refreshToken.token;
});

refreshTokenSchema.methods.verifyExpiration = () => {
    return this.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
