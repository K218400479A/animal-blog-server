"use strict"

const User = require("../models/User");
const Item = require("../models/Item");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const config = require("../config/config");
const { auth } = require("../utilities/auth");
const { body, validationResult } = require('express-validator');


module.exports = {

    get: async (req, res, next) => {
        try {
            console.log("GET items request received");
            const itemsArr = await Item.find();
            //sort by date (most recent first)
            itemsArr.sort((b, a) => {
                if (a.createdAt.valueOf() > b.createdAt.valueOf()) return 1;
                if (a.createdAt.valueOf() < b.createdAt.valueOf()) return -1;
                return 0;
            });
            res.status(200).send(itemsArr);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },

    post: {
        create: async (req, res, next) => {
            try {
                console.log("POST item request received");
                const { title, description, imgURL } = req.body;
                //authorization
                const user = await auth(req.headers.cookie);
                if (!user) return res.status(401).send("Unauthorized");
                const exists = await Item.find({ title });
                if (exists.length > 0) return res.status(400).send("Item already exists");
                //validation
                const { errors } = validationResult(req);
                if (errors.length > 0 && errors[0].param == "title") return res.status(400).send("TITLE must be at least 3 characters");
                if (errors.length > 0 && errors[0].param == "description") return res.status(400).send("DESCRIPTION must be between 15 and 1500 characters");
                if (errors.length > 0 && errors[0].param == "imgURL") return res.status(400).send("IMAGE must be valid URL");
                //creation
                const creatorID = user.id;
                const newItem = new Item({ title, description, imgURL, createdAt: new Date(), creatorID });
                const savedItem = await newItem.save();
                res.status(201).send(savedItem);
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        },
    },

    put: async (req, res, next) => {
        try {
            console.log("PUT item request recieved");
            //authorization
            const user = await auth(req.headers.cookie);
            const userID = user.id;
            const itemID = req.params.id;
            const item = await Item.findOne({ _id: itemID, creatorID: userID });
            const itemMatchedID = item.id;
            if (itemID != itemMatchedID) return res.status(401).send("Not authorized to edit this item");
            //validation
            const { errors } = validationResult(req);
            if (errors.length > 0 && errors[0].param == "title") return res.status(400).send("TITLE must be at least 3 characters");
            if (errors.length > 0 && errors[0].param == "description") return res.status(400).send("DESCRIPTION must be between 15 and 1500 characters");
            if (errors.length > 0 && errors[0].param == "imgURL") return res.status(400).send("IMAGE must be valid URL");
            //update
            const updatedItem = await Item.updateOne({ _id: req.params.id }, {
                title: req.body.title,
                description: req.body.description,
                imgURL: req.body.imgURL,
            });
            res.status(200).send(updatedItem);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },

    delete: async (req, res, next) => {
        try {
            console.log("DELETE item request received");
            //authorization
            const user = await auth(req.headers.cookie);
            const userID = user.id;
            const itemID = req.params.id;
            const item = await Item.findOne({ _id: itemID, creatorID: userID });
            const itemMatchedID = item.id;
            if (itemID != itemMatchedID) return res.status(401).send("Not authorized to delete this item");
            //deletion
            const deletedItem = await Item.deleteOne({ _id: itemID });
            if (deletedItem.deletedCount == 0) return res.status(404).send("Unable to delete item");
            res.status(200).send(deletedItem);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },




}