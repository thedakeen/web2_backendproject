const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const mongoose = require('mongoose')
const router = require('./Routes/router')
const session = require('express-session')


const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(express.urlencoded({extended: true}))

const logger = require('./logs/logger')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.use(cookieParser())
app.use(logger())


app.use(
    session({
        secret: 'wwwwww',
        saveUninitialized: false, //на фолз поменяй
        resave: true,
        cookie: {
            secure: false,
            maxAge: 3600000,
        },
    })
)

app.use(express.static(__dirname + '/view/static'))

app.set('views', './view/html')
app.set('view engine', 'ejs')

app.use((req, res, next) => {
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use(router)

async function start() {
    try {
        await mongoose.connect(
            'mongodb+srv://ansaramanzholov2005:323431@cluster1.wdbaku4.mongodb.net/?retryWrites=true&w=majority'
        )

        app.listen(3000, () => {
            console.log('App running on port 3000...')
        })
    } catch (e) {
        console.log(e)
    }
}

start()

// app.get('/testError', (req, res) => {
//     res.sendStatus(500)
// })
// app.get('/testWarn', (req, res) => {
//     res.sendStatus(400)
// })

///////////////////////////////////////////////////////

