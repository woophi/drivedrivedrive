const geoip = require('geoip-lite');
const { getUserIp } = require('../lib/helpers');

exports.getGeoData = (req) => {
	const geo = geoip.lookup(getUserIp(req));
	const city = geo && geo.city || 'not found';
	const country = geo && geo.country || 'not found';
	return {
		city,
		country
	}
}