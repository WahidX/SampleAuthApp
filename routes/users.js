const express = require('express');
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/users_controller');

router.get('/profile', passport.checkAuthentication, userController.profile);
router.get('/login', userController.login);
router.get('/signup', userController.signup);
router.post('/create-user', userController.createUser);
router.post('/create-session', passport.authenticate(
                'local',
                {failureRedirect: '/user/login'}
            ), userController.createSession);
router.get('/sign-out', userController.destroySession);

router.get('/password-check', passport.checkAuthentication, userController.passwordCheck);
router.post('/reset-password', userController.resetPassword);
router.post('/update_password', userController.updatePassword);


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate(
        'google',
        {failureRedirect: '/users/sign-in'}
    ), userController.createSession);


module.exports = router;