const Genres = require('../models/genresModel')

const genresController = {
    getBooksByGenresID: function (req, res) {
        const genresId = req.params.id
        Genres.getBooksByGenresID(genresId, function (err, genres) {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error retrieving books by genres',
                    error: err
                })
            }

            if (genres.length === 0) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No genres found',
                })
            }

            res.status(200).json({
                status: 'success',
                data: genres,
            })
        })
    }
}

module.exports = genresController