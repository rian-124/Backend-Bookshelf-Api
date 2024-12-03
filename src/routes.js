const { addBookshelfHandler, deleteBooksHandler, getAllBooks, getBookById, updateBookHandler } = require('./handler.js');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookshelfHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookById
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookHandler
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBooksHandler,
    }
];


module.exports = routes;