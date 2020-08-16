const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const User = require('../models/users');

passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        User.findOne({email:email}, function(err, user){
            if(err){
                console.log("Err while getting user--> user");
                return done(err);
            }
            
            if(user){
                bcrypt.compare(password, user.password, function(err, isMatch){
                    if(err){console.log('err while matching pass with hash',err);return;}
                    
                    console.log('isMatch  ',isMatch);

                    if(isMatch){
                        return done(null, user);
                    }
                });
            }
            else{
                console.log('password incorrect');
                return done(null, false);
            }
        });
    }
))


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