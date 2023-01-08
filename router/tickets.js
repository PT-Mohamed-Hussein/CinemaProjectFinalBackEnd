const express = require('express');
const router = express.Router();
const { GetAllTickets, DeleteTicket, AddNewTicket, GetMyTickets } = require('../controllers/TicketController')

const ROLES_LIST = require('../ConfigFolder/RolesList')
const verifyRoles = require('../middleware/verifyRoles')

router.get('/mytickets', verifyRoles(ROLES_LIST.user), GetMyTickets)
router.get('/', verifyRoles(ROLES_LIST.admin), GetAllTickets)
router.put('/', verifyRoles(ROLES_LIST.admin), DeleteTicket)
router.post('/', verifyRoles(ROLES_LIST.user), AddNewTicket)

module.exports = router;