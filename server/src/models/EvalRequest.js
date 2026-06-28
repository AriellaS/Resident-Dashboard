"use strict"

const mongoose = require("mongoose");

const evalRequestSchema = new mongoose.Schema({
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
    note: {
        type: String,
    },
    complete: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const EvalRequest = mongoose.model("EvalRequest", evalRequestSchema);

module.exports = EvalRequest;
