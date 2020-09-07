const nodeMailer = require('../config/nodemailer');

module.exports.newComment = (comment) => {

	nodeMailer.transporter.sendMail({
		from: 'mailer.droidx@gmail.com',
		to: 'wahidx93@gmail.com',
		subject: 'New Comment on your Post',
		html: `<h1>${comment} has logged in! </h1>`
	}, function(err, info){
		if(err){console.log('Error :',err);return;}


		console.log('Mail sent', info);
		return;
	});
}