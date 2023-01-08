const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req || !req.roles) return res.sendStatus(401)
        const rolesArray = [...allowedRoles]

        let auth = false

        req.roles.forEach((a) => {
            if (rolesArray.includes(a)) auth = true
        })

        if (!auth) return res.sendStatus(401)
        next()
    }
}

module.exports = verifyRoles