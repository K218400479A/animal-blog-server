"use strict"

const user = require('../controllers/user');
const item = require('../controllers/item');
const { body, validationResult } = require('express-validator');

module.exports = (app) => {

    // item
    app.get('/api/item/', item.get);
    app.post('/api/item/create',
        body('title').trim().isLength({ min: 3 }),
        body('description').trim().isLength({ min: 15, max: 1500 }),
        body('imgURL').trim().isURL(),
        item.post.create);
    app.put('/api/item/edit/:id',
        body('title').trim().isLength({ min: 3 }),
        body('description').trim().isLength({ min: 15, max: 1500 }),
        body('imgURL').trim().isURL(),
        item.put);
    app.delete('/api/item/delete/:id', item.delete);

    // user
    app.get('/api/user/', user.get);
    app.post('/api/user/register',
        body('username').trim().isLength({ min: 5 }).isAlphanumeric(),
        body('password').trim().isLength({ min: 5 }).isAlphanumeric(),
        user.post.register);
    app.post('/api/user/login', user.post.login);
    app.post('/api/user/logout', user.post.logout);
    app.delete('/api/user/delete', user.delete);
    
    // app.use('*', (req, res, next) => res.send('Invalid Route'))

};