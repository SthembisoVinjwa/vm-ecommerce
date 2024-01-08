const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "Home page"
    })
})

module.exports = app