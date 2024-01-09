const User = require('../models/users')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

exports.users_get_all = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json({
        count: users.length,
        users: users.map(user => {
          return {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.users_get = (req, res, next) => {
  User.findById(req.userData.userId)
    .select('-__v -password')
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.users_delete = (req, res, next) => {
  User.findByIdAndDelete(req.userData.userId)
    .then(result => {
      if (result) {
        res.status(200).json({
          message: 'User deleted successfully'
        })
      } else {
        res.status(401).json({
          message: 'Unauthorized request'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.users_update = (req, res, next) => {
  const updateOps = {}

  for (let i = 0; i < req.body.length; i++) {
    const op = req.body[i]
    updateOps[op.propName] = op.propValue
  }

  User.findByIdAndUpdate(
    req.userData.userId,
    { $set: updateOps },
    { new: true }
  )
    .select('-__v')
    .then(user => {
      res.status(200).json({
        message: 'User credentials updated successfully',
        user: user
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.users_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .then(users => {
      if (users.length == 0) {
        bcrypt
          .hash(req.body.password, 10)
          .then(hash => {
            const user = User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              password: hash
            })

            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: 'User created successfully'
                })
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                })
              })
          })
          .catch(err => {
            res.status(500).json({
              error: err
            })
          })
      } else {
        return res.status(409).json({
          message: 'Email already exists'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
}

exports.users_signin = (req, res, next) => {
  User.find({ email: req.body.email })
    .then(users => {
      const user = users[0]

      bcrypt
        .compare(req.body.password, user.password)
        .then(result => {
          if (result) {
            const token = jwt.sign(
              { userId: user._id, email: user.email },
              process.env.JWT_KEY,
              {
                expiresIn: '2h'
              }
            )

            return res.status(200).json({
              message: 'Authentication successful',
              token: token
            })
          } else {
            return res.status(401).json({
              message: 'Authentication failed'
            })
          }
        })
        .catch(err => {
          res.status(401).json({
            message: 'Authentication failed'
          })
        })
    })
    .catch(err => {
      res.status(401).json({
        message: 'Authentication failed'
      })
    })
}