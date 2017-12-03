var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin')
});

router.post('/', checkNotLogin, function (req, res, next) {
    var id = req.fields.id;
    var password = req.fields.password;

    UserModel.getUserById(id)
        .then(function (user) {
            if (!id) {
                req.flash('error', 'User does not exist!');
                return res.redirect('back');
            }
            if (sha1(password) !== user.password) {
                req.flash('error', 'Wrong user name or password!');
                return res.redirect('back');
            }
            req.flash('success', 'Signin successful!');
            delete user.password;
            req.session.user = user;
            res.redirect('/home');
        })
        .catch(function(e) {
            req.flash('error', 'This user has not registered yet!');
            res.redirect('/signin');
            next(e)
        });
});


module.exports = router;