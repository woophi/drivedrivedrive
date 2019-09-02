require('moment/locale/ru');
const keystone = require('keystone');
const moment = require('moment');
const { mailFrom, unsubLink } = require('./staticVars');
const { t } = require('../resources');

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
		subject: emailKeys.subject + ' | Vettura',
		moment,
		host: keystone.get('locals').host,
		t,
		...params,
		unsubLink: unsubLink(params.driver, params.uniqHash)
	}, emailError);
};

exports.getUserIp = (req) => {
	const ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);
	const splitIp = typeof ip === 'string' ? ip.split(',') : ip;
	return splitIp && splitIp.length ? splitIp[0] : splitIp;
};

//TODO: remove
exports.apiError = (res, err = { message: 'forgot to set mssg' }, code) => {
	const details = {
		err: err.message,
		code
	};
	return res.apiError(err, details, null, code);
}

exports.compareGuestTimeWithToday = (guestDate, guestTime, condition) => {
	const date = moment(guestDate).format('YYYY-MM-DD');
	const parsedDateTime = moment(`${date} ${guestTime}`, 'YYYYMMDD, HH:mm').format('YYYY-MM-DD, HH:mm');
	const today = moment().format('YYYY-MM-DD, HH:mm');

	switch (condition) {
		case 'less':
			return parsedDateTime < today;
		case 'greater':
			return parsedDateTime > today;
		case 'le':
			return parsedDateTime <= today;
		case 'ge':
			return parsedDateTime >= today;
		default:
			return null;
	}
}

exports.parseDateForWix = (date) => {
	if (date && date.length > 10) {
		return moment(Date.parse(date)).format('YYYY-MM-DD');
	}
	return date;
}
exports.parseTimeWithMoment = (time) => {
	const onlyTime = moment.utc(time, 'HH:mm');
	return onlyTime.format('HH:mm');
}
const trimSpaces = (str) => {
	if (str) {
		return str.replace(/\s/g, '');
	}
	return str;
}
exports.trimSpaces = trimSpaces;