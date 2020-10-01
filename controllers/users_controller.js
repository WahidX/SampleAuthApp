const User = require('../models/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


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

    createUser : async function(req, res) {
        
        if(req.body.password != req.body.confirm_password){
            req.flash('error', 'Password doesn\'t match');
            return res.redirect('back');
        }

        try{
            let user = await User.findOne({email:req.body.email});
            if(user){
                req.flash('error','Email already exists');
                return res.redirect('back');
            }

            // Hashing the given password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            
            let newUser = await User.create({
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name
                    
            });

            req.flash('success', 'New user created');
            return res.redirect('/user/login');
            
        } 
        catch(err){
            console.log("Err: ",err);
            return res.redirect('back');
        }
    },

    createSession : function(req, res) {
        req.flash('success', 'Loggd in successfully!');
        
        return res.redirect('/user/profile');
    },

    destroySession: function(req, res) {
        req.logout();
        req.flash('success', 'Logged out successfully!');
        return res.redirect('/');
    }, 

    passwordCheck: function(req, res){
        // Redirecting to update password if its a google verified account
        if (req.user.password.slice(0,6) === 'google'){
            return res.render('new_password',{
                'title' : 'New Password'
            });
        }

        return res.render('password-check',{
            'title': 'Confirm Password'
        });
    },

    resetPassword: async function(req, res) {
        try{
            let isMatch = await bcrypt.compare(req.body.confirm_password, req.user.password);
            if(!isMatch){
                req.flash('error', 'Incorrect Password');
                return res.redirect('back');
            }

            return res.render('new_password',{
                'title' : 'New Password'
            });
        }
        catch(err){
            console.log("err: ",err); 
            req.flash('error','Invalid password'); 
            return res.redirect('back');
        }
    },

    updatePassword: async function(req, res){
        try{
            if (req.body.new_password !== req.body.confirm_password ){
                req.flash('error', 'Passwords didn\'t match');
                return res.render('new_password',{
                    'title' : 'New Password'
                });
            }
            console.log(req.user);
            let user = await User.findById(req.user.id);
            
            // Hashing the given password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.new_password, salt);

            user.password = hashedPassword;
            user.save();

            req.logout();
            req.flash('success', 'Password Changed!');

            return res.redirect('/user/login');
        }
        catch(err){
            console.log("Err: ",err);
            return res.redirect('back');
        }
    }

};