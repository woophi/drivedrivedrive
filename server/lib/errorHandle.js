const createError = require('http-errors');

exports.apiError = (res, code = 200, err = null) => {
	const describeERR = err ? JSON.stringify(err) : 'no decription provided';
	console.trace(describeERR);
	try {
		return res.status(code).send(new createError[code]());
	} catch (error) {
		console.error('Error to construct err');
		return res.status(code).send();
	}
}