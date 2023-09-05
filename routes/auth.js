const express = require('express');
const passport = require('passport');
const router = express.Router();

// Authenticate with Google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Google authentication callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

router.post('/signup', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  // Logic for handling successful signup and redirection
  res.redirect('/dashboard');
});

// Login with user ID and password
router.post('/local', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;