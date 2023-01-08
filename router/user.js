const express = require('express');
const router = express.Router();
const { GetAllUsers, UpdateUserRoles, GetUserByEmail, GetMyUserInfo } = require('../controllers/AdminController')

const {handleUpdateUserInfo} = require('../controllers/UsersController')

const ROLES_LIST = require('../ConfigFolder/RolesList')
const verifyRoles = require('../middleware/verifyRoles')

router.get('/getmyuserinfo', verifyRoles(ROLES_LIST.user), GetMyUserInfo)
router.get('/', verifyRoles(ROLES_LIST.admin), GetAllUsers)
router.get('/:email', verifyRoles(ROLES_LIST.admin), GetUserByEmail)
router.put('/', verifyRoles(ROLES_LIST.admin), UpdateUserRoles)

router.post('/', verifyRoles(ROLES_LIST.user), handleUpdateUserInfo)

module.exports = router;