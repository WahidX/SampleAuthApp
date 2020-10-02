const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/users');

// Setting up LocalStrategy
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true         // To use req in below function
    },
    async function(req, email, password, done){
        let user = await User.findOne({email:email});
            
        if(user){
            // User found for that email so checking password
            let isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                return done(null, user);
            }
        }

        // User not found or password did not match
        req.flash('error', 'Email or password is incorrect');
        return done(null, false);
    }
))

// Only id is serialized
passport.serializeUser(function(user, done){
    done(null, user.id);
});


passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log("Err while getting user--> passport");
            return done(err);
        }

        return done(null, user);
    });
});


passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/login');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;