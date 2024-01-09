const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('index')
})

router.get('/app/user', (req, res, next) => {
    res.render('user/auth', { url: process.env.SERVER_URL})
})

module.exports = router