const express = require('express');
const router = express.Router();
const { GetAllMovies, GetMovieById, UpdateMovieById, AddNewMovie } = require('../controllers/MoviesController')

const ROLES_LIST = require('../ConfigFolder/RolesList')
const verifyRoles = require('../middleware/verifyRoles')

router.get('/', verifyRoles(ROLES_LIST.user), GetAllMovies)
router.get('/:movie', verifyRoles(ROLES_LIST.user), GetMovieById)
router.put('/', verifyRoles(ROLES_LIST.admin), UpdateMovieById)
router.post('/', verifyRoles(ROLES_LIST.admin), AddNewMovie)

module.exports = router;