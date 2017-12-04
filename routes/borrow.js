var express = require('express');
var router = express.Router();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var UserModel = require('../models/users');
var BorrowBookModel = require('../models/borrowBooks');
var BorrowBooks = require('../lib/mongo').BorrowBook;
var checkIsAdmin = require('../middlewares/check').checkIsAdmin;

router.get('/:bookId', checkIsAdmin, async (function (req, res, next) {
    var bookId = req.params.bookId;
    var result = [];
    try {
        var users = await (BorrowBookModel.getBorrowUsers(bookId));
        users.forEach(async (function(user){
            var userInfo = await (UserModel.getUserByDefaultId(user.userId))
            result.push({
                userId: user.userId,
                name: userInfo.name,
                id: userInfo.id,
                avatar: userInfo.avatar,
                borrowTime: user.created_at,
                borrowId: user._id,
                bookId: bookId,
                returnTime: user.return_time,
                bool: user.bool
            })
        }));

        setTimeout(function() {
            res.render('borrow', {
                borrowUser: result
            });
        }, 1000);  

    } catch (error) {
        next();
    }
      
}));

module.exports = router;