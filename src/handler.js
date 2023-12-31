const { nanoid } = require("nanoid")
const books = require("./books")

const addBooksHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  if (!name) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. Mohon isi nama buku"
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    })
    response.code(400)
    return response
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (req) => {
  const { name, reading, finished } = req.query
  return {
    status: "success",
    data: {
      books: books.filter((book) => {
        if (name) {
          return book.name.toLowerCase().includes(name.toLowerCase())
        }
        return true
      }).filter((book) => {
        if (reading === "0") return book.reading === false
        else if (reading === "1") return book.reading === true
        return true
      }).filter((book) => {
        if (finished === "0") return book.finished === false
        else if (finished === "1") return book.finished === true
        return true
      }).map((v) => {
        return {
          id: v.id,
          name: v.name,
          publisher: v.publisher
        }
      }),
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((book) => book.id === id)[0]

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      }
    }
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.payload

  if (!name) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. Mohon isi nama buku"
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    })
    response.code(400)
    return response
  }

  const index = books.findIndex((book) => book.id === id)
  if (index === -1) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. Id tidak ditemukan"
    })
    response.code(404)
    return response
  }
  const updatedAt = new Date().toISOString()
  const finished = pageCount === readPage

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  })
  response.code(200)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200)
    return response
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404)
  return response
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}