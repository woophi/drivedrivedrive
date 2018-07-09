// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();
// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

function toCustomLogin(req, res, next) {
	if (!req.user) res.redirect('/signin');
	if (req.user && (req.user.isAdmin || req.user.isSuperAdmin))
		next();
	else
		res.redirect('/me');
}

keystone.init({
	'name': 'VETTURA',
	'brand': 'VETTURA',

	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

  'emails':  keystone.get('env') === 'production' ? 'server/templates/emails' : 'templates/emails',

  'auto update': true,
	'session': true,
	'auth': toCustomLogin,
	'user model': 'User',
	'admin path' : 'admin',
	'trust proxy': true
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	moment: require('moment'),
	host: (function() {
		if (keystone.get('env') === 'production') return 'https://www.vettura.eu';
		return 'http://localhost:3000';
	})(),
	isMobile: false,
	SERVER_RENDERED_HTML: ''
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: 'users',
	requests: ['requests', 'prices'],
	ratings: 'ratings',
	gdpr: 'gdprs'
});

// Start Keystone to connect to your database and initialise the web server


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}


keystone.start();
