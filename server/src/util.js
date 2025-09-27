"use strict"

const isProduction = process.env.NODE_ENV==='production';

module.exports.isProduction = isProduction;

module.exports.getConfig = function() {
    if (isProduction) {
        return require("../config.json");
    } else {
        return require("../defaultConfig.json");
    }
};
