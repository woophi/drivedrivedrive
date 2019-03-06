const keystone = require('keystone');
const Visitor = keystone.list('Visitor');
const geoip = require('geoip-lite');
const parser = require('ua-parser-js');
const { getUserIp, apiError } = require('../../lib/helpers');
const { identity: { setNewToken } } = require('../../identity');

exports.setUniqVisitor = (req, res) => {
	const ua = parser(req.headers['user-agent']);
	const lang = req.headers['accept-language'];
	const geo = geoip.lookup(getUserIp(req));
	const city = geo && geo.city;
	const country = geo && geo.country;
	const browser = ua.browser;
	const os = ua.os;
	const device = ua.device;
	const uniqVisitorDataHash = setNewToken(
		{
			language: lang,
			ip: getUserIp(req),
			city,
			country,
			browser,
			os,
			device
		}
	);
	uniqVisitor = new Visitor.model({
		'value': uniqVisitorDataHash
	});
	uniqVisitor.save(err => {
		if (err) {
			return apiError(res, {message: 'Проблема сохранить tracked data' }, 500);
		}
		return res.apiResponse();
	});
};