const allowedOrigins = require('./AllowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            console.log(origin)
            callback(new Error('Not Allowed With Cors'))
        }
    },
    optionsSuccessStatus: 200,
    credentials: true, // <= Accept credentials (cookies) sent by the client
}

module.exports = corsOptions