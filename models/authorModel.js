const db = require('../config/database')

const Author = {
    getBooksByAuthorID: function (authorId, callback) {
        const query = `
        SELECT b.*
          FROM books b
          LEFT JOIN authors a ON b.Author = a.author
          WHERE a.id = ?;
        `
        db.query(query, [authorId], function (err, result) {
            if (err) {
                callback(err, null)
                return
            }
            callback(null, result)
        })
    }
}

module.exports = Author