const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketsSchema = new Schema({
    MovieTitle: {
        type: String,
        required: true
    },
    Chair: {
        type: String,
        required: true
    },
    UserEmail: {
        type: String,
        required: true
    },
    PartyDate: {
        type: String,
        required: true
    },
    TicketNo: {
        type: Number,
        required: false,
    },
    MovieId: {
        type: String,
        required: true
    },
    BuyDate: { type: Date, default: Date.now },
})


// updating the counter and the pre-saved document that need the index/number
TicketsSchema.pre('save', async function(next) {
    const all = await mongoose.model('Tickets').find()
    if (all.length <= 0) {
        this.TicketNo = 1000
    } else {
        const index = all.length - 1
        if (all[index].TicketNo) {
            this.TicketNo = all[index].TicketNo + 1
        } else {
            this.TicketNo = 1000
        }
    }
    next()
})

module.exports = mongoose.model('Tickets', TicketsSchema)