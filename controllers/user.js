"use strict"

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const config = require("../config/config");
const { auth } = require("../utilities/auth");
const { body, validationResult } = require('express-validator');

module.exports = {

    get: async (req, res, next) => {
        try {
            console.log("GET user request received");
            const user = await auth(req.headers.cookie);
            console.log(user);
            res.status(200).send(user);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },

    post: {
        register: async (req, res, next) => {
            try {
                console.log("register POST request received");
                const { username, password, rePass } = req.body;
                //validation
                const { errors } = validationResult(req);
                if (errors.length > 0 && errors[0].param == "username") return res.status(400).send("USERNAME must be at least 5 alphanumeric characters");
                if (errors.length > 0 && errors[0].param == "password") return res.status(400).send("PASSWORD must be at least 5 alphanumeric characters");
                const exists = await User.find({ username });
                if (exists.length > 0) return res.status(400).send("USERNAME already exists");
                if (password !== rePass) return res.status(400).send("Passwords must match");
                //creation
                const salt = await bcrypt.genSalt(config.saltRounds);
                const hash = await bcrypt.hash(password, salt);
                const newUser = new User({ username, password: hash });
                const savedUser = await newUser.save();
                res.status(201).send(savedUser);
            } catch (err) {
                next(err);
            }
        },
        login: async (req, res, next) => {
            try {
                console.log("login POST request received");
                const { username, password } = req.body;
                //validation
                const foundUser = await User.findOne({ username });
                if (foundUser == null) return res.status(401).send("Username and/or Password not found");
                const comparePass = await bcrypt.compare(password, foundUser.password);
                if (comparePass == false) return res.status(401).send("Username and/or Password not found");
                //creation
                const payload = {
                    id: foundUser._id,
                    username: foundUser.username
                };
                const token = jsonwebtoken.sign(payload, config.secretOrPrivateKey, config.jwtOptions);
                res.cookie(config.cookieName, token, config.cookieOptions);
                res.status(200).send({ userID: payload.id, token });
            } catch (err) {
                next(err);
            }
        },
        logout: async (req, res, next) => {
            try {
                console.log("logout POST request received");
                if (req.headers.cookie) {
                    const [cookieName, token] = req.headers.cookie.split("=");
                    res.clearCookie(cookieName);
                }
                res.status(200).send("logged out");
            } catch (err) {
                console.error(err);
                res.status(500).send(err);
            }
        },
    },

    delete: async (req, res, next) => {
        try {
            const user = await auth(req.headers.cookie);
            const [cookieName, token] = req.headers.cookie.split("=");
            const decodedValue = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));
            const deletedUser = await User.deleteOne({ _id: decodedValue.id });
            res.clearCookie(cookieName);
            if (deletedUser.deletedCount == 0) return res.status(401).send("Unable to delete user");
            res.status(200).send(deletedUser);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },

}