
const { sendEmail } = require('../../lib/helpers');
const { apiError } = require('../../lib/errorHandle');

exports.specialMessage = (req, res) => {
	if (!req.body.message) {
		return apiError(res, 400);
	}

	const message = JSON.stringify(req.body.message);
	const emailKeys = {
		templateName: 'wp-message',
		to: 'attendentofsky@gmail.com',
		subject: 'Какой-то довнер оставил сообщение'
	};

	const params = {
		message,
		driver: true
	};
	sendEmail(emailKeys, params);

	return res.apiResponse();
}