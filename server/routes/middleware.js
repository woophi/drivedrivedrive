/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
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

exports.iWannaAskU = (req, res, next) => {
	if (!!req.url && (req.url.indexOf('.php') !== -1 ||
		req.url.indexOf('wp-') !== -1
	)) {
		res.redirect('/fuckU');
	} else {
		next()
	}
}

exports.enforceHttps = (req, res, next) => {
  if (!req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV === 'production') {
    res.redirect(301, `https://${req.get('host')}${req.url}`);
  } else {
    next();
  }
}
const getApiLimiter = () => new RateLimit({
	windowMs: 60*60*1000,
	max: 500,
	message: 'Вы привысили лимит запросов на сервер, попробуйте позже через час'
});
const postApiLimiter = () => new RateLimit({
	windowMs: 60*60*1000,
	max: 100,
	message: 'Вы привысили лимит запросов на сервер, попробуйте позже через час'
});
const requestFromGuestLimit = () => new RateLimit({
	windowMs: 60*1000,
	max: 1,
	message: 'Вы привысили лимит запросов на сервер'
});
const requestFromDownerLimit = () => new RateLimit({
	windowMs: 60*60*1000,
	max: 1,
	message: 'Вы привысили лимит запросов на сервер'
});
exports.apiLimits = {
	get: getApiLimiter(),
	post: postApiLimiter(),
	request: requestFromGuestLimit(),
	downer: requestFromDownerLimit()
};