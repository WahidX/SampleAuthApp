const User = require('../models/users');
const bcrypt = require('bcryptjs');
const bc = require('bcryptjs');
const saltRounds = 10;
const loginMailer = require('../mailers/comment_mailer');


module.exports = {
    profile : function(req, res) {
        return res.render('profile',{
            title: 'Profile'
        })
    },

    login : function(req, res) {
        if(req.isAuthenticated()){
            return res.redirect('/user/profile/');
        }

        return res.render('login', {
            title : 'Login'
        });

    },

    signup : function(req, res) {
        if(req.isAuthenticated()){
            return res.redirect('/user/profile/');
        }

        return res.render('signup', {
            title : 'Signup'
        });
    },

    createUser : function(req, res) {
        
        if(req.body.password != req.body.confirm_password){
            req.flash('error', 'Password doesn\'t match');
            return res.redirect('back');
        }

        User.findOne({email:req.body.email}, function(err, user){
            if(err){console.log('Error in getting email');return;}

            if(!user){
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    if (err) {console.log('err in generating salt',err);return;}
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        if (err) {console.log('err in generating hash',err);return;}
                        
                        User.create({
                            email: req.body.email,
                            password: hash,
                            name: req.body.name
                        }, function(err, newUser){
                            if(err){console.log("Error in creating new user", err);return;}
                            console.log('New user created');
                            req.flash('success', 'New user created');
                            return res.redirect('/user/login');
                        });
                    })}
                );
            }else{
                req.flash('error', 'Email already exists');
                return res.redirect('back');
            }
        })
    },

    createSession : function(req, res) {
        req.flash('success', 'Loggd in successfully!');
        loginMailer.newComment(req.user.name);

        return res.redirect('/user/profile');
    },

    destroySession: function(req, res) {
        req.logout();
        req.flash('success', 'Loggd out successfully!');
        return res.redirect('/');
    }
};