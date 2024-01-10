const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')
const usersController = require('../controllers/usersController')

router.get('/', usersController.users_get_all)

router.get('/this', checkAuth, usersController.users_get)

router.delete('/', checkAuth, usersController.users_delete)

router.patch('/', checkAuth, usersController.users_update)

router.post('/signup', usersController.users_signup)

router.post('/signin', usersController.users_signin)

module.exports = router
