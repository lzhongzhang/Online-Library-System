var express = require('express');
var router = express.Router();

var BorrowBookModel = require('../models/borrowBooks');

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/:userId', function(req, res) {
    
})