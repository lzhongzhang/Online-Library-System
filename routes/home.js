var express = require('express');
var router = express.Router();

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var mongo = require('mongodb');
var LibraryModel = require('../models/library');
var checkLogin = require('../middlewares/check').checkLogin;

var FavoriteModel = require('../lib/mongo').Favorite;


router.get('/', async (function (req, res, next) {

    var books = await (LibraryModel.getBooks('5a246f7a4015d2070b89df75'));
    console.log(books);
    var result = [];
    if(req.session.user) {
        books.forEach(async (function(book) {
            var userId = new mongo.ObjectId(req.session.user._id);
            var bookId = new mongo.ObjectId(book._id);

            var record = await (FavoriteModel.findOne({userId: userId, bookId: bookId}).exec());
            var like = false;
            if(record !== null) {
                like = record.favorite;
            }

            result.push({
                _id: book._id,
                name: book.name,
                cover: book.cover,
                score: book.score,
                author: book.author,
                like: like,
                show: book.show
            })
        }));
    }
    else {
        result = books;
    }

    setTimeout(function() {

        res.render('home', {
            books: result
        });
    }, 1000);
}));


router.get('/:bookId/favorite', async (function(req,res){
    var userId = new mongo.ObjectId(req.session.user._id);
    var book_Id = new mongo.ObjectId(req.params.bookId);
    var record = await (FavoriteModel.findOne({userId: userId, bookId: book_Id}).exec());
    if(record === null) {
        await(FavoriteModel.insertOne({
            userId: userId,
            bookId: book_Id,
            favorite: true
        }).exec());
    }
    else {
        await(FavoriteModel.update({userId: userId, bookId: book_Id, favorite: false}, {$set:{favorite : true}}).exec());
    }
    setTimeout(function() {
        res.redirect('/');
    }, 10);
}));

router.get('/:bookId/unfavorite', async (function(req,res){
    var userId = new mongo.ObjectId(req.session.user._id);
    var book_Id = new mongo.ObjectId(req.params.bookId);

    await(FavoriteModel.update({userId: userId, bookId: book_Id, favorite: true}, {$set:{favorite : false}}).exec());

    setTimeout(function() {
        res.redirect('/');
    }, 10);
}));
module.exports = router;