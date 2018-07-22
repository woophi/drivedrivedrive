require('moment/locale/ru');
const keystone = require('keystone');
const moment = require('moment');
const { mailFrom, unsubLink } = require('./staticVars');

const emailError = (err) => {
	if (err) {
		console.error('There was an error sending the notification email:', err);
	}
};

exports.sendEmail = (emailKeys, params) => {
	new keystone.Email({
		templateName: emailKeys.templateName,
		transport: 'mailgun',
	}).send({
		to: emailKeys.to,
		from: mailFrom,
		subject: emailKeys.subject,
		moment,
		...params,
		unsubLink: unsubLink(params.driver)
	}, emailError);
};

exports.getUserIp = (req) => {
	const ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);
	return ip;
};