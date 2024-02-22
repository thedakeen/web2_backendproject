const db = require('../config/database')

const Genres = {
    getBooksByGenresID: function (genresId, callback) {
        const query = `
          SELECT b.*
          FROM books b
          LEFT JOIN genres g ON b.genres = g.genres
          WHERE g.id = ?;
        `
        db.query(query, [genresId], function (err, result) {
            if (err) {
                callback(err, null)
                return
            }
            callback(null, result)
        })
    }
}

module.exports = Genres


/////////////////