const express = require('express');
const router = express.Router();
const { handleChangePassword } = require('../controllers/UsersController')

router.put('/', handleChangePassword)

module.exports = router;