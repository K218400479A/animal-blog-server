"use strict"

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema ({

    title: {
        type: mongoose.Schema.Types.String,
        unique: true,
        required: true
    },

    description: {
        type: mongoose.Schema.Types.String,
        require: true
    },

    imgURL: {
        type: mongoose.Schema.Types.String,
        require: true
    },
 
    createdAt: {
        type: mongoose.Schema.Types.Object,
        require:true
    },

    creatorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

module.exports = mongoose.model('Item', itemSchema);