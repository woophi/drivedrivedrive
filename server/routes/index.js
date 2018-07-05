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

const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);
const { schedulerWorker } = require('../lib/scheduler');
const helmet = require('helmet');

// Common Middleware
keystone.pre('routes', middleware.initLocals);

// Import Route Controllers
const routes = {
  api: importRoutes('./api'),
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = (app) => {
	app.use(helmet());
	schedulerWorker();
	app.use(middleware.enforceHttps);
	app.use('/api/user/profile', middleware.apiLimits.get);
	app.use('/api/user/profile/update', middleware.apiLimits.post);
	app.use('/api/user/join', middleware.apiLimits.post);
	app.use('/api/sendRequest', middleware.apiLimits.request);
	// Views
  app.all('/', routes.views.index);

	// Session
	app.all('/join', routes.views.index);
	app.all('/signin', routes.views.index);
	app.all('/forgot-password', routes.views.index);
	app.all('/reset-password/:key', routes.views.index);

	// // User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.index);

	// Emails
	app.all('/unsubscribe/*', routes.views.index);

	// // Request
	app.all('/request/:id', routes.views.index);
	app.all('/request/:id/accept/:driverId', routes.views.index);
	app.all('/request/:id/confirm', routes.views.index);
	app.all('/request/:id/rate?', routes.views.index);

  // API
  app.all('/api*', keystone.middleware.api);
  app.all('/api/user/signin', routes.api.app.user.signin);
  app.all('/api/user/auth', routes.api.app.user.auth);
  app.all('/api/user/check', routes.api.app.user.checkAuth);
  app.all('/api/user/join', routes.api.app.user.register);
  app.all('/api/user/signout', middleware.validateToken, routes.api.app.user.signout);
  app.all('/api/user/password/forgot', routes.api.app.user.forgotPassword);
  app.all('/api/user/password/reset', routes.api.app.user.resetPassword);
  app.all('/api/user/password/key', routes.api.app.user.getPasswordKey);
  app.all('/api/user/profile', middleware.validateToken, routes.api.app.user.getProfile);
  app.all('/api/user/profile/update', middleware.validateToken, routes.api.app.user.updateProfile);

  app.all('/api/request/get/state', routes.api.app.request.getRequestState);
  app.all('/api/request/get', middleware.validateToken, routes.api.app.request.getRequest);
  app.all('/api/request/driver/answer', middleware.validateToken, routes.api.app.request.driverOnRequest);
  app.all('/api/request/guest/answer', routes.api.app.request.acceptRequest);
  app.all('/api/request/confirm', middleware.validateToken, routes.api.app.request.confirmRequest);
  app.all('/api/request/rate', routes.api.app.request.rateRequest);
  app.all('/api/request/get/rate', routes.api.app.request.getRequestToRate);
  app.all('/api/request/get/accept/state', routes.api.app.request.getRequestToAcceptStatus);

  app.all('/api/sendRequest', routes.api.app.form.sendRequest);
  app.all('/api/gdpr/guest', routes.api.app.gdpr.getGuestGdpr);
	app.all('/api/gdpr/user', routes.api.app.gdpr.getUserGdpr);

	app.all('/api/requests/open', routes.api.app.requests.getOpenRequests);
	app.all('/api/requests/active', routes.api.app.requests.getSubmitedRequests);
	app.all('/api/requests/history', routes.api.app.requests.getHistoryRequests);
  app.all('/api/gdpr/cookie', routes.api.app.gdpr.getCookieGdpr);
	app.all('/api/uniq/visitor/cookie', routes.api.app.visitor.setUniqVisitor);

	app.all('/api/user/unsub', middleware.validateToken, routes.api.app.emails.unsubDriver);
	app.all('/api/user/subState', routes.api.app.emails.subStateDriver);
	app.all('/api/guest/unsub', routes.api.app.emails.unsubGuest);
	app.all('/api/guest/subState', routes.api.app.emails.subStateGuest);
};
