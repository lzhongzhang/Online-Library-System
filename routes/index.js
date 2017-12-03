module.exports = function (app) {
    app.get('/', function (req, res) {
        res.redirect('./home');
    });
    app.use('/home', require('./home'));
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/library', require('./library'));
    app.use('/search', require('./search'));
    app.use('/profile', require('./profile'));
    app.use('/borrow', require('./borrow'));
    app.use('/quick_borrow', require('./quick_borrow'));
    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.status(404).render('404');
        }
    });
};