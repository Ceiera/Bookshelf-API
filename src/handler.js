/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
const { nanoid } = require('nanoid')
const books = require('./books')

// ADD BOOK HANDLER
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload

  /**
   * Server harus merespons gagal bila:
   * Client tidak melampirkan properti name pada request body.
   */

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  /**
        Server harus merespons gagal bila:
        Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
    */

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const id = nanoid(12)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0

  /**
        Bila buku berhasil dimasukkan, server harus mengembalikan respons dengan:
    */

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
}

// GET ALL BOOK HANDLER
const getAllBooksHandler = (request, h) => {
  // eslint-disable-next-line prefer-const
  const { name, reading, finished } = request.query
  let kosongan = []
  if (books.length === 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: [books.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])]
      }
    })
    response.code(200)
    return response
  }
  if (name !== undefined) {
    const daftarBuku = books.filter((buku) => buku.name.toLowerCase().includes(name.toLowerCase()))
    kosongan = daftarBuku.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])
    const response = h.response({
      status: 'success',
      data: {
        books: kosongan
      }
    })
    response.code(200)
    return response
  };

  if (reading !== undefined) {
    // eslint-disable-next-line eqeqeq
    if (reading == 1) {
      const daftarBuku = books.filter((buku) => buku.reading === true)
      kosongan = daftarBuku.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])
      const response = h.response({
        status: 'success',
        data: {
          books: kosongan
        }
      })
      response.code(200)
      return response
    }

    // eslint-disable-next-line eqeqeq
    if (reading == 0) {
      const daftarBuku = books.filter((buku) => buku.reading === false)
      kosongan = daftarBuku.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])
      const response = h.response({
        status: 'success',
        data: {
          books: kosongan
        }
      })
      response.code(200)
      return response
    }
    kosongan = books.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])
    const response = h.response({
      status: 'success',
      data: {
        books: kosongan
      }
    })
    response.code(200)
    return response
  }

  if (finished !== undefined) {
    if (finished == 1) {
      const daftarBuku = books.filter((buku) => buku.finished === true)
      kosongan = daftarBuku.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])
      const response = h.response({
        status: 'success',
        data: {
          books: kosongan
        }
      })
      response.code(200)
      return response
    }

    if (finished == 0) {
      const daftarBuku = books.filter((buku) => buku.finished === false)
      kosongan = daftarBuku.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])
      const response = h.response({
        status: 'success',
        data: {
          books: kosongan
        }
      })
      response.code(200)
      return response
    }
    kosongan = books.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])
    const response = h.response({
      status: 'success',
      data: {
        books: kosongan
      }
    })
    response.code(200)
    return response
  }
  kosongan = books.flatMap(({ id, name, publisher }) => [{ id, name, publisher }])
  const response = h.response({
    status: 'success',
    data: {
      books: kosongan
    }
  })
  response.code(200)
  return response
}

// GET BOOK BY ID HANDLER
const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const buku = books.filter((buku) => buku.id === id)

  // jika buku ada, kasih buku
  if (buku.length > 0) {
    const response = h.response({
      status: 'success',
      data: {
        book: buku[0]
      }
    })
    response.code(200)
    return response
  }

  // jika tidak, langsung kasih message
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

// UPDATE BOOK BY ID HANDLER
const updateBookByIdHandler = (request, h) => {
  const { id } = request.params
  const cari = books.findIndex((book) => book.id === id)

  // cari id dulu sebelum bergerak
  if (cari === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }

  // cek payloadnya
  const {
    name, year, author,
    summary, publisher, pageCount,
    readPage, reading
  } = request.payload
  const updatedAt = new Date().toISOString()

  //  Server harus merespons gagal bila:
  //  Client tidak melampirkan properti name pada request body.
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  // Server harus merespons gagal bila:
  //  Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  books[cari] = {
    ...books[cari], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
  }
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  })
  response.code(200)
  return response
}

// DELETE BOOK BY ID HANDLER
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params
  const cari = books.findIndex((book) => book.id === id)
  if (cari === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
  books.splice(cari, 1)
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  })
  response.code(200)
  return response
}
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler }
