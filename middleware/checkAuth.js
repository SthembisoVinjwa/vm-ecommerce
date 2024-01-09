const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
    const token = req.headers.token.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded
        next()
    } catch(err) {
        return res.status(401).json({
            message: 'Unauthorized request'
        })
    }
}

module.exports = checkAuth