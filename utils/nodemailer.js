const nodemailer = require("nodemailer");
const ApiHandler = require("./ApiHandler");

const sendMail = async (options) => {
	try {
		const transport = nodemailer.createTransport({
			host: process.env.SMTP_SERVICE,
			port: process.env.SMTP_PORT,
			// secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.SMTP_MAIL,
				pass: process.env.SMTP_PASS,
			},
		});

		const mailOption = {
			from: process.env.SMPT_MAIL,
			to: options.email,
			subject: options.subject,
			html: options.htm,
			text: options.text,
		};

		const info = await transport.sendMail(mailOption);
		console.log("Email Send: " + info.response);
	} catch (error) {
		throw new ApiHandler(500, error.message);
	}
};

module.exports = sendMail;
