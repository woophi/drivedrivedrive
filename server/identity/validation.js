const { Rstatus, ROLES } = require('../lib/staticVars');
const { verifyToken } = require('./verify');

exports.validateToken = (req, res, next) => {
	if (!req.user) {
		return res.apiResponse({
      Rstatus: Rstatus.UNAUTHORIZED
    });
	}
	const userId = req.body.userId;
	const token = req.headers.authorization || req.user.token;
	if (!token)
		return res.status(401).send({ auth: false, message: 'No token provided.', Rstatus: Rstatus.FORBIDDEN });

	const { claims, verificaitionError } = verifyToken(token);
	if (verificaitionError)
		return res.status(403).send({ auth: false, message: 'Failed to authenticate token.', Rstatus: Rstatus.FORBIDDEN });

	if (userId && userId !== claims.id)
		return res.status(400).send({ auth: false, message: 'Unable to get data.', Rstatus: Rstatus.FORBIDDEN });
	next();
}

exports.authorizedForAdmin = (req, res, next) => {
	const token = req.user && req.user.token || '';
	const { claims, verificaitionError } = verifyToken(token);
	if (verificaitionError)
		return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });

	if (!claims.roles.find(r => r === ROLES.GODLIKE || r === ROLES.ADMIN))
		return res.status(400).send({ auth: false, message: 'Unable to get data.' });
	next();
}
exports.authorizedForDriver = (req, res, next) => {
	const token = req.user && req.user.token || '';
	const { claims, verificaitionError } = verifyToken(token);
	if (verificaitionError)
		return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });

	if (!claims.roles.find(r => r === ROLES.GODLIKE || r === ROLES.DRVIER))
		return res.status(400).send({ auth: false, message: 'Unable to get data.' });
	next();
}
exports.authorizedForSuperAdmin = (req, res, next) => {
	const token = req.user && req.user.token || '';
	const { claims, verificaitionError } = verifyToken(token);
	if (verificaitionError)
		return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });

	if (!claims.roles.find(r => r === ROLES.GODLIKE))
		return res.status(400).send({ auth: false, message: 'Unable to get data.' });
	next();
}