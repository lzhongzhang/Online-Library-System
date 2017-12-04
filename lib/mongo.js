var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

var mongolass = new Mongolass();

mongolass.connect(config.mongodb);

mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});

exports.User = mongolass.model('User', {
    id: { type: 'string'},
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    gender: { type: 'string', enum: ['m', 'f', 'x'] },
    bio: { type: 'string' },
    isAdmin: { type: 'boolean'}
});
exports.User.index({ id: 1 }, { unique: true }).exec();

exports.Library = mongolass.model('Library', {
    admin: {
        type: Mongolass.Types.ObjectId
    },
    name: {
        type: 'string'
    },
    location: {
        type: 'string'
    },
    author: {
        type: 'string'
    },
    press: {
        type: 'string'
    },
    inventory: {
        type: 'number'
    },
    date: {
        type: 'string'
    },
    score: {
        type: 'number'
    },
    cover: {
        type: 'string'
    },
    introduction: {
        type: 'string'
    },
    pv: {
        type: 'number'
    },
    show: {
        type: 'boolean'
    }
});
exports.Library.index({
    admin: 1,
    _id: -1
}).exec();

exports.BorrowBook = mongolass.model('BorrowBook', {
    userId: {
        type: Mongolass.Types.ObjectId,
    },
    bookId: {
        type: Mongolass.Types.ObjectId
    },
    bool: {
        type: 'boolean'
    },
    return_time: {
        type: 'string'
    }
});

exports.Favorite = mongolass.model('Favorite', {
    userId: {
        type: Mongolass.Types.ObjectId,
    },
    bookId: {
        type: Mongolass.Types.ObjectId
    },
    favorite: {
        type: 'boolean'
    }
})

exports.BorrowBook.index({
    userId: 1,
    _id: 1
}).exec();
