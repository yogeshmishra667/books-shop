const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

//for sending email
const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);
const getLogin = (req, res, next) => {
  //because error style not hide automatic
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    //show input data after error
    oldInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

//for get => signup -->register
const getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    //show data after error
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

const postLogin = async (req, res, next) => {
  //for validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'error',
      errorMessage: errors.array()[0].msg,
      //show input data after error
      oldInput: {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });

  try {
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      //redirect when session is saved
      return req.session.save((error) => {
        console.log(error);
        res.redirect('/');
      });
    }
  } catch (error) {
    req.flash('error', 'invalid username or password!');
    return res.redirect('/login');
  }
};

//for post => signup -->register
const postSignup = async (req, res, next) => {
  const existUser = await User.findOne({ email: req.body.email });

  //for validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'error',
      errorMessage: errors.array()[0].msg,
      //show input data after error
      oldInput: {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  if (existUser) {
    req.flash('error', 'email already exist please pick another one!');
    return res.redirect('/signup');
  }

  try {
    const user = new User({
      ...req.body,
      cart: { items: [] },
    });
    const result = await user.save();
    if (result) {
      res.redirect('/login');
      return await transporter.sendMail(
        {
          to: user.email,
          from: 'yogijs667@gmail.com',
          subject: 'signup succeed!',
          html: '<h1>you successfully signup</h1>',
        },
        (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Message sent: ' + info.response);
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    res.redirect('/');
    res.status(404).send(error);
  });
};

//for reset password

const getReset = async (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

const postReset = async (req, res, next) => {
  //generate random token
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    const user = await User.findOne({ email: req.body.email });
    try {
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      //save updated user
      const result = await user.save();
      if (result) {
        res.redirect('/');
        await transporter.sendMail(
          {
            to: req.body.email,
            from: 'yogijs667@gmail.com',
            subject: 'Password reset',
            html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
          },
          (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Message sent: ' + info.response);
            }
          }
        );
      }
    } catch (error) {
      req.flash('error', 'No account with that email found.');
      return res.redirect('/reset');
    }
  });
};

//for => get ==> reset password
const getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  try {
    if (user) {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        //userId and passwordToken for for access in post request (req.body)
        userId: user._id.toString(),
        passwordToken: token,
      });
    }
  } catch (error) {
    console.log(err);
  }
};

//for post ==> reset password
const postNewPassword = async (req, res, next) => {
  const { password, userId, passwordToken } = req.body;

  const user = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });
  try {
    user.password = password; //password ==> new password
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    const result = await user.save();
    if (result) {
      res.redirect('/login');

      //send mail after reset password

      await transporter.sendMail(
        {
          to: user.email,
          from: 'yogijs667@gmail.com',
          subject: 'Password reset successfully',
          html: `
            <p>Your password reset successfully</p>
            <p>hey ${user.email} your login password has been changed</p>
          `,
        },
        (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Message sent: ' + info.response);
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
};
