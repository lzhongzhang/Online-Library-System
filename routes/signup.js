var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var checkIsAdmin = require('../middlewares/check').checkIsAdmin;

router.get('/', function (req, res, next) {
    res.render('signup');
});

router.post('/', function (req, res, next) {
    var userData = {
        id: req.fields.id,
        name: req.fields.name,
        gender: req.fields.gender,
        bio: req.fields.bio,
        avatar: req.files.avatar.path.split(path.sep).pop(),
        password: req.fields.password,
        repassword: req.fields.repassword
    }
    try {
        if (userData.password !== userData.repassword) {
            throw new Error('not match');
        }
    } catch (e) {
        fs.unlink(req.files.avatar.path);
        req.flash('error', e.message);
        return res.redirect('/signup');
    }

    userData.password = sha1(userData.password);

    var user = {
        id: userData.id,
        name: userData.name,
        password: userData.password,
        gender: userData.gender,
        bio: userData.bio,
        avatar: userData.avatar,
        isAdmin: false
    };
    UserModel.create(user)
        .then(function (result) {
            user = result.ops[0];
            delete user.password;
            req.flash('success', 'Registration success');
            res.redirect('/home');
        })
        .catch(function (e) {
            fs.unlink(req.files.avatar.path);
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', 'This Student\'s ID has been used, please try another one!');
                return res.redirect('/signup');
            }
            next(e);
        });
});

module.exports = router;