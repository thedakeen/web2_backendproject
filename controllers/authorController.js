const Author = require('../models/authorModel')

const authorController = {
    getBooksByAuthorID: function (req, res) {
        const authorId = req.params.id
        Author.getBooksByAuthorID(authorId, function (err, authors) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error retrieving books by author',
                    error: err
                })
            }

            if (authors.length === 0) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No author found',
                })
            }
            res.status(200).json({
                status: 'success',
                data: authors,
            })
        })
    }
}

module.exports = authorController