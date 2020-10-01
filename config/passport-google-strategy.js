const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');
require('dotenv');

// Setting up google strategy with app's tokens
passport.use(new googleStrategy({
        clientID: '296149790746-mikklk6u32f6erj4pu6en5kemn031a8c.apps.googleusercontent.com',
        clientSecret: 'N3EVK6w95trGUapNe8B1rmb5',
        callbackURL: 'http://localhost:8000/user/auth/google/callback',
        passReqToCallback: true
    },

    function(req, accessToken, refreshToken, profile, done){

        // Finding if the profile already there in our DB
        User.findOne({email:profile.emails[0].value}).exec(function(err, user){
            if(err){ console.log('err in google-strategy-passport',err); return;}

            // User already in DB so just returning that user
            if(user){
                return done(null, user);
            }
            else{
                // User not in DB already so first we create user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'google'+crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){ console.log('err in google-strategy-passport',err); return;}
                    
                    // Now returning that user
                    return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;