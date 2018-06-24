/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const MobileDetect = require('mobile-detect');
const keystone = require('keystone');
const secret = require('./api/staticVars').secret;
const jwt = require('jsonwebtoken');

/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.user = req.user;

	res.locals.page = {
		path: req.url.split("?")[0] // strip the query - handy for redirecting back to the page
	};

	if (req.cookies.target && req.cookies.target == locals.page.path) res.clearCookie('target');
	mobileCheck(req);
	next();
};

/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin');
	} else {
		next();
	}
};

exports.enforceHttps = function (req, res, next) {
  if (!req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV === 'production') {
    res.redirect(301, `https://${req.get("host")}${req.url}`);
  } else {
    next();
  }
}

const mobileCheck = req => {
	const md = new MobileDetect(req.headers['user-agent']);
	keystone.set('locals', {
		...keystone.get('locals'),
		isMobile: !!md.mobile()
	});
}

exports.validateToken = function (req, res, next) {
	if (!req.user) {
		return res.apiResponse({
      Rstatus: -1
    });
	}
	const userId = req.body.userId;
	const token = req.headers.authorization;
	if (!token)
		return res.status(403).send({ auth: false, message: 'No token provided.', Rstatus: -2 });
  jwt.verify(token, secret, function(err, decoded) {
    if (err)
			return res.status(500).send({ auth: false, message: 'Failed to authenticate token.', Rstatus: -2 });

		if (userId && userId !== decoded.id)
			return res.status(400).send({ auth: false, message: 'Unable to get data.', Rstatus: -2 });
    // if everything good, save to request for use in other routes
    next();
  });
}
