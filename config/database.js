const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
<<<<<<< HEAD
    user: 'root',
    password: 'password',
=======
    user: 'nbm',
    password: 'qwerty',
>>>>>>> 4b8d375ea771e2245889bdd725db176e35c4d2e0
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