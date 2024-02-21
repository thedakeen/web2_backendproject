const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const { log } = require('./logs/logger')


const bookController = require('./controllers/bookController')
const authorController = require('./controllers/authorController')
const genresController = require('./controllers/genresController')



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((req, res, next) => {
    const {method, originalUrl, ip} = req
    const route = `${method} ${originalUrl}`

    // Log request information for all levels
    log('info', route, ip)
    log('warn', route, ip)
    log('error', route, ip)

    next()
})
// app.get('/testError', (req, res) => {
//     res.sendStatus(500)
// })
// app.get('/testWarn', (req, res) => {
//     res.sendStatus(400)
// })


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
    console.log('Listening on port 3000')
})