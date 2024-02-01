const express = require('express')
const router = express.Router()
const axios = require('axios')

axios.defaults.baseURL = process.env.SERVER_URL

router.get('/', async (req, res, next) => {
    const response = await axios.get('items')
    let items = []

    if (response.status === 200) {
        items = response.data
    }

    res.render('index', {url: process.env.SERVER_URL, items: items})
})

router.get('/browse', async (req, res, next) => {
    const response = await axios.get('items')
    let items = []

    if (response.status === 200) {
        items = response.data
    }

    res.render('browse', { items: items })
})

router.get('/filter', async (req, res, next) => {
    const query = req.query
    console.log("query from render.ejs => ",query)

    const apiUrl = `http://localhost:3000/items?color=${query['color']}&type=${query['type']}`;
    console.log(apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            let items = data

            res.render('browse', { items: items })
        })
        .catch(error => {
            console.error('Error:', error);
        });

})

router.get('/user/signin', (req, res, next) => {
    res.render('user/auth', { url: process.env.SERVER_URL })
})

router.get('/user/update', (req, res, next) => {
    res.render('user/update', { url: process.env.SERVER_URL })
})

router.get('/user/forgot', (req, res, next) => {
    res.render('user/forgot', { url: process.env.SERVER_URL })
})

router.get('/user/forgot/email', (req, res, next) => {
    res.render('user/email.ejs', { url: process.env.SERVER_URL })
})

module.exports = router