const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })

    } catch (err) {
        console.error(err)
        return console.log(`Server Terminated. Couldn't Connect To The DataBase`)
    }
}

module.exports = connectDB