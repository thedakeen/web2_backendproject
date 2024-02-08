const Book = require('../models/bookModel')

function validateBook(book) {
    const {Name, Author, PublishYear, PagesCount, Price} = book

    if (typeof Name !== 'string' || Name.length < 2 || Name.length > 255 ||
        typeof Author !== 'string' || Author.length < 2 || Author.length > 255) {
        return false
    }

    if (!Number.isInteger(PublishYear) || PublishYear < 1900 || PublishYear > 2024 ||
        !Number.isInteger(PagesCount) || PagesCount < 3 || PagesCount > 1300 ||
        typeof Price !== 'number' || Price < 0 || Price > 150000) {
        return false
    }

    return true
}


const bookController = {
    getAllBooks: function (req, res) {
        Book.getAllBooks(function (err, books) {
            if (err) {
                res.status(500).json({message: 'Error'})
            } else {
                res.status(200).json({data: books})
            }
        })
    },

    getAllAuthors: function (req, res) {
        Book.getAllAuthors(function (err, authors) {
            if (err) {
                res.status(500).json({message: 'Error'})
            } else {
                res.status(200).json({data: authors})
            }
        })
    },

    getAllGenres: function (req, res) {
        Book.getAllGenres(function (err, genres) {
            if (err) {
                res.status(500).json({message: 'Error'})
            } else {
                res.status(200).json({data: genres})
            }
        })
    },

    getBooksByPages: function (req, res) {
        const page = req.query.page || 1
        const pageSize = 10
        const offset = (page - 1) * pageSize
        Book.getBooksPage(offset, pageSize, function (err, paginatedBooks) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Internal server error',
                    error: err
                })
            }

            if (paginatedBooks.length === 0) {
                return res.status(404).json({
                    status: 'Not Found',
                    message: 'No books found for the specified page.',
                })
            }

            res.status(200).json({
                status: 'success',
                results: paginatedBooks.length,
                data: {
                    books: paginatedBooks,
                },
            })
        })

    },

    addBook: function (req, res) {
        const newBook = req.body.book

        const isValid = validateBook(newBook)

        if (!isValid) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid book data',
            })
        }

        Book.addBook(newBook, function (err, result) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error adding book',
                    error: err
                })
            }

            res.status(201).json({
                status: 'success',
                message: 'Book added successfully.',
                data: {
                    book: newBook,
                },
            })
        })
    },

    updateBook: function (req, res) {
        const bookId = parseInt(req.params.id, 10)
        const updatedBook = req.body.book

        const isValid = validateBook(updatedBook)

        if (!isValid) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid book data',
            })
        }

        Book.updateBook(bookId, updatedBook, function (err, result) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error updating book',
                    error: err
                })
            }

            res.status(201).json({
                status: 'success',
                message: 'Book updated successfully.',
                data: {
                    book: updatedBook,
                },
            })
        })
    },

    deleteBook: function (req, res) {
        const bookId = parseInt(req.params.id, 10)

        Book.deleteBook(bookId, function (err, result) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error deleting book',
                    error: err
                })
            }

            if (!result) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Book not found. Check ID',
                })
            }

            res.status(200).json({
                status: 'success',
                message: 'Book deleted successfully.',
                data: {
                    book: bookId,
                },
            })
        })
    },

    /////////////////////////// find book by name and price

    getBookByName: function (req, res) {
        const bookName = req.params.name

        Book.getBookByName(bookName, function (err, book) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error retrieving book by name',
                    error: err
                })
            }

            if (!book) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No books found with the specified name.',
                })
            }

            res.status(200).json({
                status: 'success',
                data: {
                    book: book,
                },
            })
        })
    },

    getBookByPrice: function (req, res) {
        const bookPrice = req.params.price
        Book.getBookByPrice(bookPrice, function (err, books) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error retrieving books by price',
                    error: err
                })
            }

            if (books.length === 0) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No books found with the specified price',
                })
            }

            res.status(200).json({
                status: 'success',
                data: books,
            })
        })
    },

    // zdes novie metody
}

module.exports = bookController

