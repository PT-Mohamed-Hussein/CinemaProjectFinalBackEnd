const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Picture: {
        type: String,
        required: true
    },
    Director: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Duration: {
        type: String,
        required: true,
    },
    Trailer: {
        type: String,
        required: true
    },
    Parties: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now },
    releaseDate: { type: String, required: true },
    ratingID: { type: Number, required: true },
})

module.exports = mongoose.model('Movies', MovieSchema)