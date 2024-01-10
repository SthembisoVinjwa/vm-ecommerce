const User = require('../models/users')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

exports.users_get_all = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json({
        count: users.length,
        users: users.map(user => {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            hash: user.password
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

async function ops (req) {
  let updateOps = {}

  for (let i = 0; i < req.body.length; i++) {
    const op = req.body[i]

    if (op.propName === 'password') {
      updateOps[op.propName] = await bcrypt.hash(op.propValue, 10)
    } else {
      updateOps[op.propName] = op.propValue
    }
  }

  return updateOps
}

exports.users_forgot = async function (req, res) {
  try {
    const user_email = req.userData.email
    const user = await User.findOne({ email: user_email })

    if (!user) {
      return res.status(400).json({ message: 'Sorry Email does not Exist!' })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: '587',
      auth: {
        user: 'vinjwacr7@gmail.com',
        pass: process.env.MAIL_PW
      },
      secureConnection: 'false',
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    })
    const mailOptions = {
      from: 'vinjwacr7@gmail.com',
      to: 'vinjwacr7@gmail.com',
      subject: 'Please Reset your Password',
      html: `<h3>Dear User</h3>
        <p>You have requested to reset your password. To reset your password successfully, follow the link below to reset it</p>
        <p>Click <a href="${process.env.SERVER_URL}app/user/forgot">${process.env.SERVER_URL}app/user/forgot</a></p>
        <p>Regards,</p><p>VM ecommerce</p>`
    };    

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) throw error
      return res.status(200).json({ error: false, data: info, message: 'OK' })
    })
  } catch (err) {
    res.status(500).json({ message: err })
  }
}

exports.users_update = (req, res, next) => {
  ops(req)
    .then(updateOps => {
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
