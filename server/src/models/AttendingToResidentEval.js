"use strict"

const mongoose = require("mongoose");
const Promise = require("bluebird");
const Questions = require('../forms/AttendingToResidentEvalForm');
const Schema = mongoose.Schema;

const QUESTION_NAMES = Questions.map(q => { return q.name });

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
    form: {
        type: [{
            name: { type: String, enum: QUESTION_NAMES, required: true },
            option: { type: String }
        }]
    },
});

attendingToResidentEvalSchema.statics.validateInput = (form) => {
    // TODO also check that for radio questions, option is a number less than numOptions
    form.forEach(q => {
        if (!QUESTION_NAMES.includes(q.name)) return false;
    });
    return true;
}

const AttendingToResidentEval = mongoose.model("AttendingToResidentEval", attendingToResidentEvalSchema);

module.exports = AttendingToResidentEval;
