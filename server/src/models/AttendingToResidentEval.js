"use strict"

const mongoose = require("mongoose");
const Promise = require("bluebird");

const Schema = mongoose.Schema;

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
});

attendingToResidentEvalSchema.pre("save", function(next) {
    let attendingToResidentEval = this;

    if (attendingToResidentEval.evaluator.role != "ATTENDING") {
        return next(new Error("Evaluator must be an attending"));
    }
    if (attendingToResidentEval.evaluatee.role != "RESIDENT") {
        return next(new Error("Evaluatee must be a resident"));
    }

    next()
});

const AttendingToResidentEval = mongoose.model("AttendingToResidentEval", attendingToResidentEvalSchema);

module.exports = AttendingToResidentEval;
