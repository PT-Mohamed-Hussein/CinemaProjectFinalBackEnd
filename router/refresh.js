const express = require('express');
const router = express.Router()
const { handleRefreshToken } = require('../controllers/UsersController')

router.get('/', handleRefreshToken)

module.exports = router