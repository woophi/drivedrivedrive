// @flow
require('moment/locale/ru');
const keystone = require('keystone');
const moment = require('moment');
const { mailFrom } = require('../routes/api/staticVars');

const emailError = (err) => {
	if (err) {
		console.error('There was an error sending the notification email:', err);
	}
};

exports.sendEmail = (emailData, req) => {
	new keystone.Email({
		templateName: emailData.templateName,
		transport: 'mailgun',
	}).send({
		to: emailData.to,
		from: mailFrom,
		subject: emailData.subject,
		guestData: emailData.requestData,
		host: req.headers.origin,
		moment
	}, emailError);
};

exports.getUserIp = (req) => {
	const ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);
	return ip;
};