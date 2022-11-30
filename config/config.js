"use strict"

require('dotenv').config({ path: __dirname + "/../.env"});

const env = process.env.NODE_ENV;
const config = {
    port: Number(process.env.PORT),
    dbURL: process.env.DATABASE_URI,
    saltRounds: Number(process.env.SALT),
    secretOrPrivateKey: process.env.SECRET,
    jwtOptions: {
        expiresIn: Number(process.env.JWT_EXP),
    },
    cookieName: process.env.COOKIE_NAME,
    cookieOptions: {
        maxAge: Number(process.env.COOKIE_EXP),
        httpOnly: true
    }
};

module.exports = config;
