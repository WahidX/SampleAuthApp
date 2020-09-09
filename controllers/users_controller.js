const User = require('../models/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const resetCodeMailer = require('../mailers/reset_code_mailer');


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

    resetPassword: async function(req, res) {
        // Sends mail n then renders the reset page
        req.app.reset_code = crypto.randomBytes(3).toString('hex');
        
        try{
            if (!req.app.u_email){
                req.app.u_id = req.user.id;
                req.app.u_email = req.user.email;
            }
        
            resetCodeMailer.resetCode(
                "<h1>Hi req.user.name,</h1><br><h5>Here's your password reset code</h5><h3> `" + req.app.reset_code +"`</h3>",
                req.app.u_email
            );
            console.log('reset code sent : ',req.app.reset_code);
            req.flash('success', 'Reset code sent');
            return res.render('reset_code_verify',{
                'title' : 'Reset Password'
            });
        }catch(err){ console.log("err: ",err); req.flash('error','Access Denied!'); return res.redirect('back');}
    },

    resetCodeCheck: function(req, res){
        // TODO Account lockdown and resend mail

        if(req.body.reset_code == req.app.reset_code){
            req.app.reset_code = null;
            return res.redirect('/user/new-password');
        }else{
            req.flash('error', 'Invalid code');
            return res.redirect("back");
        }
    },

    newPassword: function(req, res){
        // Renders the page for taking new password
        return res.render('new_password',{
            'title' : 'New Password'
        });
    },

    updatePassword: async function(req, res){
        try{
            console.log()
            if (req.body.new_password != req.body.confirm_password ){
                req.flash('error', 'Passwords didn\'t match');
                return res.redirect('back');
            }

            let user = await User.findById(req.app.u_id);
            
            // Hashing the given password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.new_password, salt);

            user.password = hashedPassword;
            user.save();

            req.app = null;
            req.logout();
            req.flash('success', 'Password Changed!');

            return res.redirect('/user/login');
        }
        catch(err){
            console.log("Err: ",err);
            return res.redirect('back');
        }
    },

    getEmail : function(req,res){
        return res.render('get_email',{
            'title': 'Confirm email'
        });
    },

    forgetPassword : async function(req, res) {
        let user = await User.findOne({'email': req.body.get_email});
        if(!user){
            req.flash('error','Email not registered');
            return res.redirect('back');
        }

        req.app.u_email = req.body.get_email;
        req.app.u_id = user._id;
        return res.redirect('/user/reset-password');
    }

};