const Movies = require('../models/Movies')

const GetAllMovies = async(req, res) => {
    const Movie = await Movies.find();
    if (!Movie) return res.status(204).json({ "message": "No Movies Found" })
    res.json(Movie)
}

const GetMovieById = async(req, res) => {
    if (!req || !req.params.movie) return res.status(400).json({ "message": "Movie ID Is Required" })
    const Movie = await Movies.findOne({ _id: req.params.movie }).exec()
    if (!Movie) return res.status(400).json({ "message": `Movie ID: ${req.params.movie} Not Exist In Our Records` })
    res.json(Movie)
}

const UpdateMovieById = async(req, res) => {
    if (!req.body || !req.body.id || !req.body.releasedate || !req.body.ratingid || !req.body.title || !req.body.category || !req.body.desc || !req.body.pic || !req.body.director || !req.body.duration || !req.body.parties || !req.body.trailer) return res.status(400).json({ "message": "Some Information Are Missing." })
    const Movie = await Movies.findOne({ _id: req.body.id }).exec()
    if (!Movie) return res.status(400).json({ "message": `Movie ID: ${req.body.id} Not Exist In Our Records` })
    const resp = await Movies.updateOne({ _id: req.body.id }, {
        $set: {
            Title: req.body.title,
            Description: req.body.desc,
            Picture: req.body.pic,
            Director: req.body.director,
            Duration: req.body.duration,
            Trailer: req.body.trailer,
            Parties: req.body.parties,
            Category: req.body.category,
            releaseDate: req.body.releasedate,
            ratingID: req.body.ratingid
        }
    })
    if (resp.modifiedCount > 0) {
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
}

const AddNewMovie = async(req, res) => {
    if (!req.body || !req.body.title || !req.body.releasedate || !req.body.ratingid || !req.body.category || !req.body.desc || !req.body.pic || !req.body.director || !req.body.duration || !req.body.trailer) return res.status(400).json({ "message": "Some Information Are Missing." })
    try {
        //create and store at once with mongoose
        const result = await Movies.create({
            Title: req.body.title,
            Description: req.body.desc,
            Picture: req.body.pic,
            Director: req.body.director,
            Duration: req.body.duration,
            Trailer: req.body.trailer,
            Parties: req.body.parties,
            Category: req.body.category,
            releaseDate: req.body.releasedate,
            ratingID: req.body.ratingid
        })

        res.status(201).json({ 'message': "Movie Created Successfully" })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { GetAllMovies, GetMovieById, UpdateMovieById, AddNewMovie }