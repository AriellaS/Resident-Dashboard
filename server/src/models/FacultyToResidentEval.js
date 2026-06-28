"use strict"

const mongoose = require("mongoose");
const Questions = require('../forms/FacultyToResidentEvalForm');
const Schema = mongoose.Schema;

const QUESTION_NAMES = Questions.map(q => { return q.name });

const facultyToResidentEvalSchema = new Schema({
    evaluator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false,
    },
    evaluatee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    pgy: {
        type: Number
    },
    form: {
        type: [{
            name: { type: String, enum: QUESTION_NAMES, required: true },
            option: { type: String }
        }]
    }
}, { timestamps: true });

facultyToResidentEvalSchema.statics.validateInput = (form) => {
    // TODO also check that for radio questions, option is a number less than numOptions
    form.forEach(q => {
        if (!QUESTION_NAMES.includes(q.name)) return false;
    });
    return true;
}

const FacultyToResidentEval = mongoose.model("FacultyToResidentEval", facultyToResidentEvalSchema);

module.exports = FacultyToResidentEval;
