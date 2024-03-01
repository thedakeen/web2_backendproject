const {registerValidator, loginValidator} = require('../validations/auth')

const {Router} = require('express')


const userController = require('../controllers/userController')

const bookController = require('../controllers/bookController')
const authorController = require('../controllers/authorController')
const genresController = require('../controllers/genresController')
const router = Router()
const {authorizationCheck, refuse, verifyToken, isAdmin, isAdminOrManager} = require('../utils/AuthMiddleware')


router.get('/books', bookController.getAllBooks)
router.get('/booksPages', bookController.getBooksByPages)
router.get('/books/byName/:name', bookController.getBookByName)
router.get('/books/byPrice/:price', bookController.getBookByPrice)
router.post('/books/add', verifyToken, isAdminOrManager, bookController.addBook)
router.route('/books/:id')
    .put(verifyToken, isAdminOrManager, bookController.updateBook)
    .delete(verifyToken, isAdmin, bookController.deleteBook)

// Авторы
router.get('/authors', bookController.getAllAuthors)
router.get('/authors/:id/books', authorController.getBooksByAuthorID)

// Жанры
router.get('/genres', bookController.getAllGenres)
router.get('/genres/:id/books', genresController.getBooksByGenresID)


/////////////////////

router.get('/user/login', refuse, userController.loginForm)
router.post('/user/login', loginValidator, userController.login)
router.get('/user/register', refuse, userController.registrationForm)
router.post('/user/register', registerValidator, userController.registration)
router.post('/user/logout', authorizationCheck, userController.logout)
router.post('/user/loginWithFacebook', refuse, userController.loginWithFacebook)


router.get('/', verifyToken, userController.home)

router.get('/user/recovery', refuse, userController.forgotPasswordForm)
router.post('/user/recovery', refuse, userController.sendOtp)
router.post('/user/verify-otp', refuse, userController.verifyOtp)
router.post('/user/change-password', refuse, userController.changePassword)


module.exports = router
