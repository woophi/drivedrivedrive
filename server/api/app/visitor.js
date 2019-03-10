const keystone = require('keystone');
const Visitor = keystone.list('Visitor');
const parser = require('ua-parser-js');
const { apiError } = require('../../lib/helpers');
const { getGeoData } = require('../../lib/tracking');
const { identity: { setNewToken } } = require('../../identity');

exports.setUniqVisitor = (req, res) => {
	const ua = parser(req.headers['user-agent']);
	const lang = req.headers['accept-language'];
	const geoData = getGeoData(req);
	const browser = ua.browser;
	const os = ua.os;
	const device = ua.device;
	const uniqVisitorDataHash = setNewToken(
		{
			language: lang,
			city: geoData.city,
			country: geoData.country,
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