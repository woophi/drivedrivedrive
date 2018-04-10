var keystone = require('keystone'),
		async = require('async'),
		_ = require('lodash'),
		moment = require('moment');

exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/signin');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'request';
	locals.form = req.body;
	locals.filters = {
		requestId: req.params.id,
	};
	locals.alreadyAssigned = false;
	locals.alreadySubmited = false;

	const authUser = req.user;
	const RequestModel = keystone.list('Request').model;
	const PriceModel = keystone.list('Price').model;

	// Load the current request
	view.on('init', function (next) {
		RequestModel.findById(locals.filters.requestId).exec(function (err, result) {
			if (result.submitedOn) {
				locals.alreadySubmited = true;
				next(err);
			} else {
				locals.request = result;
				next(err);
			}
		});

	});

	view.on('init', function (next) {
		RequestModel.findById(locals.filters.requestId).where('assignedBy', authUser._id).exec(function (err, resultPrice) {

			if (!resultPrice) {
				next(err);
			} else {
				locals.alreadyAssigned = true;
				next(err);
			}
		});

	});

	view.on('post', { action: 'driver.answer.request' }, function(next) {

		if (locals.alreadySubmited) {
			return next();
		} else if (locals.alreadyAssigned) {
			return next();
		}

		if (!req.body.requestPrice) {
			req.flash('error', "Please enter your price.");
			return next();
		}

		async.series([

			function(cb) {
				const	newPrice = new PriceModel({
					value: req.body.requestPrice,
					submitedBy: authUser,
					assignedRequest: locals.filters.requestId
				});

				newPrice.save(function(err) {
					return cb(err);
				});

			},

			function(cb) {
				RequestModel.findById(locals.filters.requestId).exec(function (err, resultRequest) {
					PriceModel.findOne()
						.where('submitedBy', authUser._id)
						.where('assignedRequest', resultRequest._id)
						.exec(function (err, resultPrice) {

							const assignedData = {
								'assignedBy': [...resultRequest.assignedBy, authUser._id],
								'assignedPrices': [...resultRequest.assignedPrices, resultPrice._id]
							};

							resultRequest.getUpdateHandler(req).process(assignedData, {
								fields: 'assignedBy, assignedPrices,',
								flashErrors: true
							}, function(err) {
								locals.alreadyAssigned = true;
								return cb(err);
							});
					});
				});
			},

			function (cb) {
				RequestModel.findById(locals.filters.requestId).exec(function(err, result) {
					const driverForEmail = {
						specialPhoto: authUser._.specialPhoto.src(),
						driverPhoto: authUser._.driverPhoto.thumbnail(175, 175),
						name: authUser.name,
						car: authUser.car,
						id: authUser._id,
						from: result.guest.from,
						to: result.guest.to
					};
						new keystone.Email({
							templateName: 'guest-notify',
							transport: 'mailgun',
						}).send({
							to: result.guest,
							from: {
								name: 'DRIVE SUKA DRIVE',
								email: 'postmaster@sandboxdae723c3f3084598b74d3512385ba33b.mailgun.org',
							},
							subject: `Трансфер ${result.guest.from} - ${result.guest.to}`,
							driverData: driverForEmail,
							host: req.headers.origin,
							price: req.body.requestPrice,
							requestId: locals.filters.requestId
						}, (e) => e && console.warn('not done', e));
						return cb();
				});
			}

		], function(err){

			var onSuccess = function(err) {
				req.flash('success', 'Ваше ценовое предложение отправлено');
				return next(err)
			}

			var onFail = function(erre) {
				req.flash('error', 'Что-то пошло не так... попробуйте еще раз');
				return next(err);
			}
			if (err) onFail(err);

			onSuccess(err);

		});

	});

	// Render the view
	view.render('request');
};
