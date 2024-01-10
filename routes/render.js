const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('index')
})

router.get('/user/signin', (req, res, next) => {
    res.render('user/auth', { url: process.env.SERVER_URL})
})

router.get('/user/update', (req, res, next) => {
    res.render('user/update', { url: process.env.SERVER_URL})
})

router.get('/user/forgot', (req, res, next) => {
    res.render('user/forgot', { url: process.env.SERVER_URL})
})

module.exports = router