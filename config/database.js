const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '256782366595d',
    database: 'web2'
})

connection.connect((err) => {
    if (err) {
        console.error('Failed connection to DB ' + err.stack)
        return
    }
    console.log('DB connected successfully')
})

module.exports = connection