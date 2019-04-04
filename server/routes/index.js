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
const { identity: { validateToken, authorizedForAdmin } } = require('../identity');

// Common Middleware
keystone.pre('routes', middleware.initLocals);

// Import Route Controllers
const routes = {
  api: importRoutes('../api'),
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = (app) => {
	app.use(helmet());
	schedulerWorker();
	app.use(middleware.enforceHttps);
	app.use(middleware.iWannaAskU);
	app.use('/api/user/profile', middleware.apiLimits.get);
	app.use('/api/user/profile/update', middleware.apiLimits.post);
	app.use('/api/user/join', middleware.apiLimits.post);
	app.use('/api/sendRequest', middleware.apiLimits.request);
	app.use('/api/sendMeMessage', middleware.apiLimits.downer);
	// Views
  app.get('/', routes.views.index);

	// Session
	app.get('/join', routes.views.index);
	app.get('/signin', routes.views.index);
	app.get('/forgot-password', routes.views.index);
	app.get('/reset-password/:key', routes.views.index);

	// // User
	app.get('/me', routes.views.index);

	// Emails
	app.get('/unsubscribe/*', routes.views.index);

	// // Request
	app.get('/request/:id', routes.views.index);
	app.get('/request/:id/accept/:driverId', routes.views.index);
	app.get('/request/:id/confirm', routes.views.index);
	app.get('/request/:id/rate?', routes.views.index);
	app.get('/requests', routes.views.index);

	// guest
  app.get('/guest/:id/:hash', routes.views.index);
  app.get('/guest', routes.views.index);
  app.get('/fuckU', routes.views.index);

	// new admin
	app.get('/adm*', authorizedForAdmin, routes.views.index);

  // API
  app.all('/api*', keystone.middleware.api);
  app.post('/api/user/signin', routes.api.app.user.signin);
  app.post('/api/user/auth', routes.api.app.user.auth);
  app.post('/api/user/check', routes.api.app.user.checkAuth);
  app.post('/api/user/join', routes.api.app.user.register);
  app.post('/api/user/signout', validateToken, routes.api.app.user.signout);
  app.post('/api/user/password/forgot', routes.api.app.user.forgotPassword);
  app.post('/api/user/password/reset', routes.api.app.user.resetPassword);
  app.post('/api/user/password/key', routes.api.app.user.getPasswordKey);
  app.post('/api/user/profile', validateToken, routes.api.app.user.getProfile);
  app.post('/api/user/profile/update', validateToken, routes.api.app.user.updateProfile);

  app.post('/api/request/get/state', routes.api.app.request.getRequestState);
  app.post('/api/request/get', validateToken, routes.api.app.request.getRequest);
  app.post('/api/request/driver/answer', validateToken, routes.api.app.request.driverOnRequest);
  app.post('/api/request/guest/answer', routes.api.app.request.acceptRequest);
  app.post('/api/request/confirm', validateToken, routes.api.app.request.confirmRequest);
  app.post('/api/request/rate', routes.api.app.request.rateRequest);
  app.post('/api/request/get/rate', routes.api.app.request.getRequestToRate);
  app.post('/api/request/get/accept/state', routes.api.app.request.getRequestToAcceptStatus);

  app.post('/api/sendRequest', routes.api.app.form.sendRequest);
  app.post('/api/gdpr', routes.api.app.gdpr.getGdprData);
  app.post('/api/sendMeMessage', routes.api.app.admin.specialMessage);

	app.post('/api/user/unsub', validateToken, routes.api.app.emails.unsubDriver);
	app.post('/api/user/subState', routes.api.app.emails.subStateDriver);
	app.post('/api/guest/unsub', routes.api.app.emails.unsubGuest);
	app.post('/api/guest/subState', routes.api.app.emails.subStateGuest);

	app.post('/api/requests/open', validateToken, routes.api.app.requests.getOpenRequests);
	app.post('/api/requests/active', validateToken, routes.api.app.requests.getSubmitedRequests);
	app.post('/api/requests/history', validateToken, routes.api.app.requests.getHistoryRequests);
	app.post('/api/requests/process', validateToken, routes.api.app.requests.getInProcessRequests);

	// adm requests
	app.post('/api/adm/requests/all', authorizedForAdmin, routes.api.admin.requests.getAll);
	app.post('/api/adm/request/get', authorizedForAdmin, routes.api.admin.request.getRequest);
	app.post('/api/adm/request/update', authorizedForAdmin, routes.api.admin.request.updateRequest);
	app.post('/api/adm/request/approve', authorizedForAdmin, routes.api.admin.request.approveRequest);

	// guest api
	app.post('/api/guest/get/request', routes.api.app.guest.getGuestRequest);
	app.post('/api/guest/update/request', routes.api.app.guest.updateGuestRequest);
};
