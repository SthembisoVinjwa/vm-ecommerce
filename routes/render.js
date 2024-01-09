const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('index')
})

router.get('/app/user/signin', (req, res, next) => {
    res.render('user/auth', { url: process.env.SERVER_URL})
})

router.get('/app/user/update', (req, res, next) => {
    res.render('user/update', { url: process.env.SERVER_URL})
})

module.exports = router