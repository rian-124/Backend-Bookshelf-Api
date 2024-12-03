const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf.js");


const addBookshelfHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBookShelf = {id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  if (!name) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if ( readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }


  bookshelf.push(newBookShelf);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
      const response = h.response({
          status: 'success',
          message: "Buku berhasil ditambahkan",
          data: {
            bookId : id,
          },
      });
      response.code(201);
      return response;
    }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal di tambahkan.',
  });
  response.code(500);
  return response;
};

const getAllBooks = (request, h) => {
 const books = bookshelf.map((book) => {
    const { id, name, publisher } = book;
    return {id, name, publisher};
 });
 const { reading, name, finished } = request.query;
 if ( reading === '1' ) {
   const readingBook = bookshelf.filter((readingBook) => readingBook.reading === true).map((readingBook) => {
    const { id, name, publisher } = readingBook;
    return { id, name, publisher };
   })
  const response = h.response({
    status: 'success',
    data: {
      books: readingBook,
    }
  });
  response.code(200);
  return response;
 };

 if ( reading === '0') {
  const unreadingBook = bookshelf.filter((unreadingBook) => unreadingBook.reading === false).map((unreadingBook) => {
    const { id, name, publisher } = unreadingBook;
    return { id, name, publisher };
  });
  const response = h.response({
    status: 'success',
    data: {
      books: unreadingBook,
    }
  });
  response.code(200);
  return response;
 }

 if (finished === '1') {
  const finishedBooks = bookshelf
    .filter((book) => book.readPage === book.pageCount)
    .map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });

  return h.response({
    status: 'success',
    data: {
      books: finishedBooks,
    },
  }).code(200);
}

if (finished === '0') {
  const unfinishedBooks = bookshelf
    .filter((book) => book.readPage < book.pageCount)
    .map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });

  return h.response({
    status: 'success',
    data: {
      books: unfinishedBooks,
    },
  }).code(200);
}

if (name) {
  const filteredBooks = bookshelf.filter((book) => book.name === name ).map((book) => {
    const { id, name, publisher } = book;
    return { id, name, publisher };
  });

  const response =  h.response({
    status: 'success',
    data: {
      books: filteredBooks,
    },
  });
  response.code(200);
  return response;
}


  const response = h.response({
    status: 'success',
    data: {
      books : books
    }
  });
  response.code(200);
  return response;
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = bookshelf.find((book) => book.id === bookId);
 
  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt } = book
  const bookObject = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

  const response = h.response({
    status: 'success',
    data: {
      book: bookObject
    }
  });
  response.code(200);
  return response;
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = bookshelf.findIndex((index) => index.id === bookId);

  if(index !== -1 ) {

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    };
    
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    };

    bookshelf[index] = {
      ...bookshelf[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response
  };

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;

};

const deleteBooksHandler = (request, h) => {
    
    const { bookId } = request.params;
    const index = bookshelf.findIndex((index) => index.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);
    const response = h.response({
      status : 'success',
      message : 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  };

  const reponse = h.response({
    status : 'fail',
    message : 'Buku gagal dihapus. Id tidak ditemukan',
  });

  reponse.code(404);
  return reponse;
}

module.exports = { addBookshelfHandler, deleteBooksHandler, getAllBooks, getBookById, updateBookHandler};
