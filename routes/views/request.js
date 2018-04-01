var keystone = require('keystone'),
		async = require('async'),
		_ = require('lodash'),
		moment = require('moment');

exports = module.exports = function (req, res) {

	if (!req.user) {
		return res.redirect('/admin/signin');
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

	function callback (err) {
		if (err) {
			console.error('There was an error sending the notification email:', err);
		}
	};

	// Load the current request
	view.on('init', function (next) {

		RequestModel.findById(locals.filters.requestId).exec(function (err, result) {
			// todo: if result null
			if (!!result && result.accepted) {
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

		if(locals.alreadyAssigned) {
			return next();
		}

		(function() {
			RequestModel.findById(locals.filters.requestId).exec(function (err, result) {
				if (!!result && result.accepted) {
					locals.alreadySubmited = true;
					return next();
				}
			});
		})();

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

			function(cb) {
				const driverForEmail = {
					photoFront: authUser._.photoFront.thumbnail(100, 100),
					photoSide: authUser._.photoSide.thumbnail(100, 100),
					photoInside: authUser._.photoInside.thumbnail(100, 100),
					driverPhoto: authUser._.driverPhoto.thumbnail(100, 100),
					name: authUser.name,
					car: authUser.car,
					id: authUser._id
				};
				RequestModel.findById(locals.filters.requestId).exec(function(err, result) {
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
						}, callback);
						return cb();
				});

			},

		], function(err){

			var onSuccess = function() {
				req.flash('success', 'Ваше ценовое предложение отправлено');
				return next();
			}

			var onFail = function(e) {
				req.flash('error', 'Что-то пошло не так... попробуйте еще раз');
				return next();
			}
			if (err) return onFail(err);

			onSuccess();

		});

	});

	// Render the view
	view.render('request');
};
