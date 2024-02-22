const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const app = express()


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(bodyParser.json())
