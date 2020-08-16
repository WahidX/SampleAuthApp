const bcrypt = require("bcryptjs")


module.exports = {
    getHash: function(password){
        return bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                console.log('err in generating salt',err);
                return;
            } 
            else {
                return bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        console.log('err in generating hash',err);
                        return;
                    }
                })
            }
        });
        
    },

    compareHash: function(password, hash){
        bcrypt.compare(password, hash, function(err, isMatch){
            if(err){
                console.log('err while matching pass with hash',err);
                return;
            }
            
            return isMatch;
        })
    }

}