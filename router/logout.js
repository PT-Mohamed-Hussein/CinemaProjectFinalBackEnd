const express = require('express')
const router = express.Router()
const { handleLogout } = require('../controllers/UsersController')

router.post('/', handleLogout)

module.exports = router