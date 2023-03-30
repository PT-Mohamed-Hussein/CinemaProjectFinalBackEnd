const allowedOrigins = require('./AllowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not Allowed With Cors'))
        }
    },
    optionsSuccessStatus: 200,
    credentials: true, // <= Accept credentials (cookies) sent by the client
}

module.exports = corsOptions