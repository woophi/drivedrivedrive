const { secret } = require('../lib/staticVars');
const jwt = require('jsonwebtoken');

exports.verifyToken = (token = '') => {
	let result = {
		verificaitionError: null,
		claims: {}
	};
	jwt.verify(token, secret, (err, decoded) => {
		result.verificaitionError = err;
		result.claims = decoded;
	});
	return result;
}