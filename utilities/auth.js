"use strict"

const secret = require("../config/config").secretOrPrivateKey;
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
    auth: async (cookie) => {
        try {
            if (cookie) {
                const [cookieName, token] = cookie.split("=");
                jsonwebtoken.verify(token, secret);
                const decodedValue = await JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf8"));
                const { id, username } = decodedValue;
                const exists = await User.findOne({ "_id": id })
                if (exists) {
                    const user = { id, username, };
                    return user;
                }
                return false;
            }
            return false;
        } catch (err) {
            console.error("Unauthorized!");
            return false;
        };
    }
}