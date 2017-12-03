var express = require('express');
var router = express.Router();

var LibraryModel = require('../models/library');
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/:payload', function (req, res, next) {
    var payload = req.params.payload,
        type = req.query.type;

    LibraryModel.searchBook(payload)
        .then(function (books) {
            switch (type) {
                case 'library':
                    res.render('library', {
                        books: books
                    });
                    break;
                default:
                    res.render('home', {
                        books: books
                    });
            }  
        })
        .catch(next);
});



module.exports = router;