const validation = require('./validation');
const assign = require('./assign');
const verify = require('./verify');
const claims = require('./claims');

exports.identity = {
	...validation,
	...assign,
	...verify,
	...claims
}