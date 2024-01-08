const express = require('express')
const router = express.Router()
const User = require('../models/users')

router.post('/signup', (req, res, next) => {

    User.find({ email: req.body.email })
    .then(users => {
        if (users.length == 0) {
            console.log(true)
        } else {
            console.log(false)
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router