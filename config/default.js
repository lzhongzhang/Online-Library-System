module.exports = {
    port: 3000,
    session: {
        secret: 'libraryManagemengtSys',
        key: 'librarySys',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/library_system'
}