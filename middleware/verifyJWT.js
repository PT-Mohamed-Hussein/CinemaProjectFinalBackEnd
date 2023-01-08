const jwt = require('jsonwebtoken');

const verifyJWt = (req, res, next) => {
    const authHeader = req.headers.authentication || req.headers.Authentication;

    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ 'message': 'Access Token Expired.' }); //invalid token
        req.email = decoded.email;
        req.roles = decoded.roles
        next()
    })
}

module.exports = verifyJWt