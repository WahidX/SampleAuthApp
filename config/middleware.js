const flash = require('connect-flash');

// Syncing req.flash and res.flash
module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error' : req.flash('error')
    }
    next();
}