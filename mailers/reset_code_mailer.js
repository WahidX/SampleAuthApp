const nodeMailer = require('../config/nodemailer');

module.exports.resetCode = (message, email) => {

	nodeMailer.transporter.sendMail({
		from: 'mailer.droidx@gmail.com',
		to: email,
		subject: 'Reset Code',
		html: message
	}, function(err, info){
		if(err){console.log('Error :',err);return;}


		console.log('Mail sent', info);
		return;
	});
}