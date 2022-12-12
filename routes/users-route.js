const express = require('express');
const router = express.Router({ mergeParams: true });

const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

const User = require('../models/user');
const { validateRegister, validateLogin } = require('../utils/mw-validateAuth');
const { isLoggedIn, isLoggedInNeg } = require('../utils/mw-authentication'); // isLoggedInNeg (použitý pro odmítnutí přihlášení, pokud už je user signed in) je opak isLoggedIn
const { limitPost, limitIp } = require('../utils/post-limit')

const { isFromUserRoute } = require('../utils/checkReferer')

//controllers require:
const users = require('../controllers/users');
//

router.get('/register', users.register);

router.post('/register', isLoggedInNeg, limitIp, validateRegister, catchAsync(users.postRegister));

router.get('/login', users.login);

router.post('/login', isLoggedInNeg, limitIp, validateLogin, passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true,
    keepSessionInfo: true // pro zachování req.session.returnTo (původní URL, kam jsme se chtěli dostat ještě než nás to přesměrovalo)
}), users.postLogin);

router.get('/logout', limitPost, catchAsync(users.logout));

router.get('/profile/:username', catchAsync(users.show));

router.post('/usernamecheck', catchAsync(users.usernamecheck))

module.exports = router;