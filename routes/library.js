var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var LibraryModel = require('../models/library');
var BorrowBookModel = require('../models/borrowBooks');
// var FavoriteModel = require('../models/FavoriteBook');
var UserModel = require('../models/users');
var checkLogin = require('../middlewares/check').checkLogin;
var checkIsAdmin = require('../middlewares/check').checkIsAdmin;

router.get('/', checkIsAdmin, async(function (req, res, next) {
    var admin = req.query.admin;
    
    try {
        var books = await (LibraryModel.getBooks(admin));
        books.forEach(async (function(book) {
            try {
                var borrowCount = await (BorrowBookModel.getBorrowBooksCount(book._id));
                book.borrowCount = borrowCount;
            } catch (error) {
                req.flash('error', 'Something go wrong, please try again!');
            }
        }), this);

        setTimeout(() => {
            res.render('library', {
                books: books
            });
        }, 1000)
    } catch (error) {
        req.flash('error', 'Something go wrong, please try again!');
        next();
    }

}));

router.post('/', checkIsAdmin, async (function (req, res, next) {
    var admin = req.session.user._id;

    var bookData = {
        admin: req.session.user._id,
        name: req.fields.name,
        location: req.fields.location,
        author: req.fields.author,
        press: req.fields.press,
        inventory: parseInt(req.fields.inventory),
        date: req.fields.date,
        score: parseInt(req.fields.score),
        cover: req.fields.cover_url || req.files.cover.path.split(path.sep).pop() ,
        introduction: req.fields.introduction
    }
    try {
        if (!bookData.name.length) {
            throw new Error('Please fill in the name!');
        }
        if (!bookData.introduction.length) {
            throw new Error('Please fill in the introduction!');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var book = {
        admin: bookData.admin,
        name: bookData.name,
        location: bookData.location,
        author: bookData.author,
        press: bookData.press,
        inventory: bookData.inventory,
        date: bookData.date,
        score: bookData.score,
        cover: bookData.cover,
        introduction: bookData.introduction,
        pv: 0,
        show: true
    };
    
    var checkBook = await (LibraryModel.checkBook(book.name));

    if (!checkBook.length) {
        LibraryModel.create(book)
        .then(function (result) {
            book = result.ops[0];
            req.flash('success', 'Add successfully!');
            res.redirect(`/library`);
        })
        .catch(next);
    } else {
        req.flash('error', 'This book has already exist!');
        res.redirect(`/library`);
    }
    
}));

router.get('/:bookId', function (req, res, next) {
    var bookId = req.params.bookId;

    Promise.all([
        LibraryModel.getBookById(bookId),
        LibraryModel.incPv(bookId)
    ])
        .then(function (result) {
            var book = result[0];
            if (!book) {
                throw new Error('The book does not exist!');
            }
            book.location = book.location;
            res.render('book', {
                book: book
            });
        })
        .catch(next);
});

router.get('/:bookId/remove', checkIsAdmin, function (req, res, next) {
    var bookId = req.params.bookId;
    var admin = req.session.user._id;

    LibraryModel.delBookById(bookId, admin)
        .then(function () {
            req.flash('success', 'Delete the book successfully!');
            res.redirect('/library');
        })
        .catch(next);
});

router.post('/:bookId/edit', checkIsAdmin, function (req, res, next) {
    var bookId = req.params.bookId;
    var admin = req.session.user._id;
    
    var bookData = {
        name: req.fields.name,
        author: req.fields.author,
        press: req.fields.press,
        inventory: parseInt(req.fields.inventory),
        date: req.fields.date,
        score: parseInt(req.fields.score),
        introduction: req.fields.introduction
    };

    LibraryModel.updateBookById(bookId, admin, bookData)
        .then(function () {
            req.flash('success', 'Edit book success!');
            res.redirect('/library');
        })
        .catch(next);
});

router.get('/:bookId/borrow', checkIsAdmin, async (function (req, res, next) {
    var userId = req.session.user._id;
    var bookId = req.params.bookId;
    
    var borrow = {
        userId: userId,
        bookId: bookId,
        bool: false
    };
    try {
        var book = await (LibraryModel.getRawBookById(borrow.bookId));
        if (book.inventory >= 1) {
            try {
                await (LibraryModel.updateBookById(borrow.bookId, '5a246f7a4015d2070b89df75', {
                    inventory: book.inventory - 1
                }))
                try {
                    await (BorrowBookModel.create(borrow))
                    req.flash('success', 'Borrow Successfully!');
                    res.redirect('back');
                } catch (error) {
                    req.flash('error', 'Something go wrong, please try again!');
                    res.redirect('back');
                }
            } catch (error) {
                req.flash('error', 'Something go wrong, please try again!');
                res.redirect('back');
            }
            
        } else {
            req.flash('error', 'Zero inventory!');
            res.redirect('back');
        }
    } catch (error) {
        req.flash('error', 'Something go wrong, please try again!');
        res.redirect('back');
    }
    
}));
router.get('/:bookId/borrow/:userId', checkIsAdmin, async (function (req, res, next) {
    var userId = req.params.userId;
    var bookId = req.params.bookId;
    var user = await (UserModel.getUserById(userId));
    if (!user) {
        req.flash('error', 'There is no Student Id exist, please try another one!');
        res.redirect('back');
        return false;
    }

    var borrow = {
        userId: user._id,
        bookId: bookId,
        bool: false,
    };

    try {
        var book = await (LibraryModel.getRawBookById(borrow.bookId));
        if (book.inventory >= 1) {
            try {
                await (LibraryModel.updateBookById(borrow.bookId, '5a246f7a4015d2070b89df75', {
                    inventory: book.inventory - 1
                }))
                try {
                    await (BorrowBookModel.create(borrow))
                    req.flash('success', 'Borrow Successfully by ' + userId +'!');
                    res.redirect('back');
                } catch (error) {
                    req.flash('error', 'Something go wrong, please try again!');
                    res.redirect('back');
                }
            } catch (error) {
                req.flash('error', 'Something go wrong, please try again!');
                res.redirect('back');
            }
            
        } else {
            req.flash('error', 'Zero inventory!');
            res.redirect('back');
        }
    } catch (error) {
        req.flash('error', 'Your book Id maybe wrong, please try again!');
        res.redirect('back');
    }
    
}));



module.exports = router;