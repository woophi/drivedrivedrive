/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const keystone = require('keystone');
const secret = require('../lib/staticVars').secret;
const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = (req, res, next) => {
	res.locals.user = req.user;

	res.locals.page = {
		path: req.url.split("?")[0] // strip the query - handy for redirecting back to the page
	};

	if (req.cookies.target && req.cookies.target == locals.page.path) res.clearCookie('target');
	next();
};

/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = (req, res, next) => {
	if (!req.user) {
		res.redirect('/signin');
	} else {
		next();
	}
};

exports.enforceHttps = (req, res, next) => {
  if (!req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV === 'production') {
    res.redirect(301, `https://${req.get('host')}${req.url}`);
  } else {
    next();
  }
}

exports.validateToken = (req, res, next) => {
	if (!req.user) {
		return res.apiResponse({
      Rstatus: -1
    });
	}
	const userId = req.body.userId;
	const token = req.headers.authorization;
	if (!token)
		return res.status(403).send({ auth: false, message: 'No token provided.', Rstatus: -2 });
  jwt.verify(token, secret, (err, decoded) => {
    if (err)
			return res.status(500).send({ auth: false, message: 'Failed to authenticate token.', Rstatus: -2 });

		if (userId && userId !== decoded.id)
			return res.status(400).send({ auth: false, message: 'Unable to get data.', Rstatus: -2 });
		// if everything good, save to request for use in other routes
		next();
	});
}
const getApiLimiter = () => new RateLimit({
	windowMs: 60*60*1000,
	delayAfter: 499,
	delayMs: 1000,
	max: 500,
	message: 'Вы привысили лимит запросов на сервер, попробуйте позже через час'
});
const postApiLimiter = () => new RateLimit({
	windowMs: 60*60*1000,
	delayAfter: 99,
	delayMs: 1000,
	max: 100,
	message: 'Вы привысили лимит запросов на сервер, попробуйте позже через час'
});
const requestFromGuestLimit = () => new RateLimit({
	windowMs: 60*1000,
	delayMs: 0,
	max: 1,
	message: 'Вы привысили лимит запросов на сервер'
});
exports.apiLimits = {
	get: getApiLimiter(),
	post: postApiLimiter(),
	request: requestFromGuestLimit()
};