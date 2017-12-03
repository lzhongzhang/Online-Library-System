var Library = require('../lib/mongo').Library;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
    create: function create(book) {
        return Library.create(book).exec();
    },
    getBookById: function (bookId) {
        return Library
            .findOne({ _id: bookId })
            .populate({ path: 'admin', model: 'User' })
            .addCreatedAt()
            .exec();
    },
    getBooks: function(admin) {
        var query = {};
        if (admin) {
            query.admin = admin;
        }
        return Library
            .find(query)
            .populate({ path: 'admin', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .exec();
    },
    searchBook: function(data) {
        var queryData = new RegExp(data.trim());
        return Library
            .find({
                '$or': [{
                    name: queryData
                }, {
                    author: queryData
                }, {
                    press: queryData
                }]
            })
            .sort({ _id: -1 })
            .exec();
    },
    checkBook: function(bookName) {
        return Library
                .find({ name: bookName })
                .exec();
    },
    getRawBookById: function (bookId) {
        return Library
            .findOne({ _id: bookId })
            .populate({ path: 'admin', model: 'User' })
            .exec();
    },
    updateBookById: function (bookId, admin, data) {
        return Library.update({ admin: admin, _id: bookId }, { $set: data }).exec();
    },
    delBookById: function (bookId, admin) {
        return Library.update({ admin: admin, _id: bookId }, { $set: {show : false}}).exec();
    },
    incPv: function incPv(bookId) {
        return Library
            .update({ _id: bookId }, { $inc: { pv: 1 } })
            .exec();
    }
};