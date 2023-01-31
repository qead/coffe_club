const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	port: 465,
	host: process.env.SMTP_host,
	auth: {
		user: process.env.SMTP_user,
		pass: process.env.SMTP_pass //process.env.SMTP
	},
	secure: true
});

export default transporter;