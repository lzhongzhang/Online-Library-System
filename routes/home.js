var express = require('express');
var router = express.Router();

var LibraryModel = require('../models/library');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res, next) {
    LibraryModel.getBooks('5a246f7a4015d2070b89df75')
        .then(function (books) {
            res.render('home', {
                books: books
            });
        })
        .catch(next);
});

module.exports = router;