const express = require('express');
const passport = require('passport');
const { handleGoogleCallback } = require('../Controller/googleController');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/register' }), handleGoogleCallback);

module.exports = router;