const express = require('express');
const router = express.Router();

const ROLES_LIST = require('../ConfigFolder/RolesList')

router.get('/', (req, res) => {

    if (!req || !req.roles) return res.sendStatus(403)
        //console.log(req.roles)
        //if have admin
    let auth = false
    req.roles.forEach((a) => {
        if (a === ROLES_LIST.admin) auth = true
    })
    if (!auth) return res.sendStatus(403)
    res.sendStatus(200)
})

module.exports = router;