/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
const scheduler = require('./scheduler');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
  api: importRoutes('./api'),
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	scheduler.schedulerWorker();
	// Views
  app.all('/', routes.views.index);

	// Session
	app.all('/join', routes.views.index);
	app.all('/signin', routes.views.index);
	// app.get('/signout', routes.views.session.signout);
	app.all('/forgot-password', routes.views.index);
	// app.all('/reset-password/:key', routes.views.session['reset-password']);

	// // User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.index);

	// // Request
	// app.all('/request/:id', routes.views.request);
	// app.all('/request/:id/accept/:driverId', routes.views.acceptRequest);
	// app.all('/request/:id/confirm', routes.views.confirmRequest);
	// app.all('/request/:id/rate', routes.views.rateRequest);

  // API
  app.all('/api*', keystone.middleware.api);
  app.all('/api/user/signin', routes.api.app.user.signin);
  app.all('/api/user/auth', routes.api.app.user.auth);
  app.all('/api/user/check', routes.api.app.user.checkAuth);
  app.all('/api/user/join', routes.api.app.user.register);
  app.all('/api/user/signout', routes.api.app.user.signout);

  app.all('/api/sendRequest', routes.api.app.form.sendRequest);
};
