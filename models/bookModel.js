const db = require('../config/database')
const twilio = require('twilio')

const Book = {
    // get all books
    getAllBooks: function (callback) {
        const query = 'SELECT * FROM books'
        db.query(query, callback)
    },


    getAllAuthors: function (callback) {
        const query = 'SELECT DISTINCT Author FROM books'
        db.query(query, callback)
    },

    getAllGenres: function (callback) {
        const query = 'SELECT DISTINCT Genres FROM books'
        db.query(query, callback)
    },


    /// get books by page (10 on each)
    getBooksPage: function (offset, limit, callback) {
        const query = 'SELECT * FROM books LIMIT ?, ?'
        db.query(query, [offset, limit], callback)
    },


    addBook: function (newBook, callback) {
        db.query('SELECT id FROM authors WHERE author = ?', [newBook.Author], (err, result) => {
            if (err) {
                callback(err)
                return
            }

            if (result.length > 0) {
                const authorId = result[0].id
                insertBook(newBook, authorId, callback)
            } else {
                db.query('INSERT INTO authors (author) VALUES (?)', [newBook.Author], (err, result) => {
                    if (err) {
                        callback(err)
                        return
                    }
                    const authorId = result.insertId
                    insertBook(newBook, authorId, callback)
                })
            }
        })
    },


    updateBook: function (bookId, updatedBook, callback) {
        const query = 'UPDATE books SET Name = ?, Author = ?, Genres = ?, PagesCount = ?, Price = ?, PublishYear = ? WHERE id = ?'
        const values = [updatedBook.Name, updatedBook.Author, updatedBook.Genres, updatedBook.PagesCount, updatedBook.Price, updatedBook.PublishYear, bookId]
        db.query(query, values, function (err, result) {
            if (err) {
                callback(err, null)
                return
            }
            if (result.affectedRows === 0) {
                // if book not found
                callback(null, false)
                return
            }
            callback(null, true)
        })
    },

    deleteBook: function (bookId, callback) {
        const query = 'DELETE FROM books WHERE id = ?'

        db.query(query, [bookId], function (err, result) {
            if (err) {
                callback(err, null)
                return
            }
            if (result.affectedRows === 0) {
                callback(null, false)
                return
            }
            callback(null, true)
        })
    },

    getBookByName: function (bookName, callback) {
        const query = 'SELECT * FROM books WHERE Name = ?'
        db.query(query, [bookName], function (err, result) {
            if (err) {
                callback(err, null)
                return
            }
            if (result.length === 0) {
                callback(null, null)
                return
            }
            callback(null, result[0])
        })
    },

    getBookByPrice: function (bookPrice, callback) {
        const query = 'SELECT * FROM books WHERE Price = ?'
        db.query(query, [bookPrice], function (err, result) {
            if (err) {
                callback(err, null)
                return
            }
            callback(null, result)
        })
    },


}

function insertBook(newBook, authorId, callback) {
    const query = 'INSERT INTO books (Name, Author, Genres, PagesCount, Price, PublishYear) VALUES (?, ?, ?, ?, ?, ?)'
    const values = [newBook.Name, newBook.Author, newBook.Genres, newBook.PagesCount, newBook.Price, newBook.PublishYear]
    db.query(query, values, (err, result) => {
        if (err) {
            callback(err)
            return
        }

        sendWhatsAppNotification(newBook)
            .then(() => {
                callback(null, 'Book added successfully')
            })
            .catch(error => {
                callback(error)
            })
    })
}

function sendWhatsAppNotification(newBook) {
    return new Promise((resolve, reject) => {
        const client = twilio('AC6f8556eafc6177e6571671e83c66c7f0', '5602432721bc47fbd98bfefe576ff9ec')

        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: `New book added: ${JSON.stringify(newBook)}`,
                to: 'whatsapp:+77006582239'
            })
            .then(message => {
                console.log('WhatsApp notification sent:', message.sid)
                resolve()
            })
            .catch(error => {
                console.error('Error sending WhatsApp notification:', error)
                reject(error)
            })
    })
}


module.exports = Book
