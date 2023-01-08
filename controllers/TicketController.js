const Tickets = require('../models/Tickets')

const Movies = require('../models/Movies')

const GetAllTickets = async(req, res) => {
    const Ticket = await Tickets.find();
    if (!Ticket) return res.status(204).json({ "message": "No Tickets Found" })
    res.json(Ticket)
}

const AddNewTicket = async(req, res) => {
    if (!req.body || !req.body.id || !req.body.title || !req.body.chair || !req.body.email || !req.body.partydate) return res.status(400).json({ "message": "Some Information Are Missing." })
    try {

        const Movie = await Movies.findOne({ _id: req.body.id }).exec()

        if (!Movie) return res.status(400).json({ "message": `Movie ID: ${req.body.id} Not Exist In Our Records` })

        //Check Seat Availablity 

        let Parties = JSON.parse(Movie.Parties)

        let bParties = JSON.parse(req.body.partydate)
        if (!Parties[bParties.date][bParties.time][req.body.chair]) return res.status(400).json({ "message": `Chair ${req.body.chair.replace(/SeatID/, '')} On ${bParties.date} At ${bParties.time} For Movie ${req.body.title} Not Available` })

        Parties[bParties.date][bParties.time][req.body.chair] = false

        const resp = await Movies.updateOne({ _id: req.body.id }, {
            $set: {
                Parties: JSON.stringify(Parties),
            }
        })
        if (resp.modifiedCount > 0) {

            const result = await Tickets.create({
                MovieTitle: req.body.title,
                Chair: req.body.chair,
                UserEmail: req.body.email,
                PartyDate: req.body.partydate,
                MovieId: req.body.id
            })

            res.status(201).json({ 'message': "Ticket Created Successfully" })

        } else {
            res.sendStatus(500)
        }

    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

const DeleteTicket = async(req, res) => {
    if (!req.body || !req.body.id || !req.body.movieid || !req.body.title || !req.body.chair || !req.body.email || !req.body.partydate) return res.status(400).json({ "message": "Some Information Are Missing." })
    try {
        //create and store at once with mongoose
        const Movie = await Movies.findOne({ _id: req.body.movieid }).exec()
        let Parties = JSON.parse(Movie.Parties)

        let bParties = JSON.parse(req.body.partydate)
        if (Parties[bParties.date][bParties.time][req.body.chair]) return res.status(400).json({ "message": `Chair ${req.body.chair.replace(/SeatID/, '')} On ${bParties.date} At ${bParties.time} For Movie ${req.body.title} Is Already Not Reserved` })

        Parties[bParties.date][bParties.time][req.body.chair] = true

        const resp = await Movies.updateOne({ _id: req.body.movieid }, {
            $set: {
                Parties: JSON.stringify(Parties),
            }
        })
        if (resp.modifiedCount > 0) {
            const result = await Tickets.deleteOne({
                MovieTitle: req.body.title,
                Chair: req.body.chair,
                UserEmail: req.body.email,
                PartyDate: req.body.partydate,
                TicketNo: req.body.id
            })
            if (result.deletedCount > 0) {
                res.status(201).json({ 'message': "Ticket Removed Successfully." })
            } else {
                res.sendStatus(500)
            }
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

const GetMyTickets = async(req, res) => {
    if(!req.email) return res.status(400).json({message: 'You Have To Login First'})
    const Ticket = await Tickets.find({UserEmail: req.email});
    if (!Ticket) return res.status(204).json({ "message": "No Tickets Found" })
    res.json(Ticket)
}

module.exports = { GetAllTickets, DeleteTicket, AddNewTicket, GetMyTickets }