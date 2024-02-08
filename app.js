const express = require('express')
const app = express()

const bookController = require('./controllers/bookController')
const authorController = require('./controllers/authorController')
const genresController = require('./controllers/genresController')

app.use(express.json())


app.route('/books').get(bookController.getAllBooks)
app.route('/booksPages').get(bookController.getBooksByPages)
app.route('/books/byName/:name').get(bookController.getBookByName)
app.route('/books/byPrice/:price').get(bookController.getBookByPrice)
app.route('/books/add').post(bookController.addBook)


app.route('/authors').get(bookController.getAllAuthors)
app.route('/authors/:id/books').get(authorController.getBooksByAuthorID)


app.route('/genres').get(bookController.getAllGenres)
app.route('/genres/:id/books').get(genresController.getBooksByGenresID)


app
    .route('/books/:id')
    .put(bookController.updateBook)
    .delete(bookController.deleteBook)

app.listen(3000, () => {
    console.log('Server')
})