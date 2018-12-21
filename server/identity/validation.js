const { secret, Rstatus } = require('../lib/staticVars');
const jwt = require('jsonwebtoken');

exports.validateToken = (req, res, next) => {
	if (!req.user) {
		return res.apiResponse({
      Rstatus: Rstatus.UNAUTHORIZED
    });
	}
	const userId = req.body.userId;
	const token = req.headers.authorization;
	if (!token)
		return res.status(403).send({ auth: false, message: 'No token provided.', Rstatus: Rstatus.FORBIDDEN });
  jwt.verify(token, secret, (err, decoded) => {
		console.warn(decoded);
    if (err)
			return res.status(500).send({ auth: false, message: 'Failed to authenticate token.', Rstatus: Rstatus.FORBIDDEN });

		if (userId && userId !== decoded.id)
			return res.status(400).send({ auth: false, message: 'Unable to get data.', Rstatus: Rstatus.FORBIDDEN });
		next();
	});
}