"use strict"

const mongoose = require("mongoose");
const Promise = require("bluebird");

const Schema = mongoose.Schema;

const BRIEFING_OPTIONS = ["PHONE", "DAYOF", "NONE"];
const RATING_OPTIONS = ["5", "4", "3", "2", "1"];

const attendingToResidentEvalSchema = new Schema({
    evaluator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    evaluatee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    briefing: {
        type: String,
        enum: BRIEFING_OPTIONS,
        required: true
    },
    rating: {
        type: String,
        enum: RATING_OPTIONS,
        required: true
    }
});

attendingToResidentEvalSchema.statics.validateInput = (briefing, rating) => {
    return BRIEFING_OPTIONS.includes(briefing) && RATING_OPTIONS.includes(rating);
}

const AttendingToResidentEval = mongoose.model("AttendingToResidentEval", attendingToResidentEvalSchema);

module.exports = AttendingToResidentEval;
