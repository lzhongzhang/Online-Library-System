var express = require('express');
var router = express.Router();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var UserModel = require('../models/users');
var LibraryModel = require('../models/library');
var BorrowBookModel = require('../models/borrowBooks');
var checkLogin = require('../middlewares/check').checkLogin;
var checkIsAdmin = require('../middlewares/check').checkIsAdmin;

router.get('/:userId', checkLogin, async (function (req, res, next) {
    var currentUser = req.session.user;
    var userId = req.params.userId;
    var user = await (UserModel.getUserByDefaultId(userId));
    
    try {
        var bBook = await (BorrowBookModel.getBorrowBooks(user._id))

        var result = [];
        bBook.forEach(async (function(item) {
            var book = await (LibraryModel.getRawBookById(item.bookId));

            var temp = item.created_at.split(" ");
            var returnTime = temp[0].split("-");
            var rtMonth = parseInt(returnTime[1]) + 1;
            var rtYear = parseInt(returnTime[0]);
            if (rtMonth > 12) {
                rtYear += 1;
                rtMonth -= 12;
            }
            var rTime = rtYear + "-" + rtMonth + "-" + returnTime[2];

            var returnDate = item.return_time;


            result.push({
                id: item._id,
                userId: userId,
                bookId: item.bookId,
                created_at: item.created_at,
                returnTime: rTime,
                name: book.name,
                author: book.author,
                cover: book.cover,
                introduction: book.introduction,
                bool: item.bool,
                returnDate: returnDate
            })
        }));
        setTimeout(() => {
            res.render('profile', {
                profile: user,
                borrow: result
            })  
        }, 1000)
    } catch(e) {
        req.flash('error', 'Something go wrong, please try again!');
    }
}));

router.get('/:bookId/return2/:userId', checkIsAdmin, async (function (req, res, next) {
    var bookId = req.params.bookId,
        userId = req.params.userId;
    
    var user = await (UserModel.getUserById(userId));
   
    try {
        await (BorrowBookModel.returnBookByBookId(bookId, user._id)); // bookid, user._id
        var book = await (LibraryModel.getRawBookById(bookId));
        try {
            await (LibraryModel.updateBookById(bookId, '5a246f7a4015d2070b89df75', {
                inventory: book.inventory + 1
            }))
            req.flash('success', 'Return Successfully!');
            res.redirect('back');
        } catch (e) {
            req.flash('error', 'Something go wrong, please try again!');
            res.redirect('back');
        } 
    } catch (error) {
        req.flash('error', 'Can\'t find the borrowed record, please try again!');
        res.redirect('back');
    }
}));

module.exports = router;