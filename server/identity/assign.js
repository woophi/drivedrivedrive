const { secret } = require('../lib/staticVars');
const jwt = require('jsonwebtoken');

exports.setNewToken = (params = {}) => {
	return jwt.sign(params, secret, {
		expiresIn: 86400
	});
}