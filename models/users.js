var User = require('../lib/mongo').User;

module.exports = {
    create: function (user) {
        return User.create(user).exec();
    },
    getUserById: function (id) {
        return User
                .findOne({ id: id })
                .addCreatedAt()
                .exec();
    },
    getUserByDefaultId: function(id) {
        return User
                .findOne({ _id: id})
                .addCreatedAt()
                .exec();
    }
};