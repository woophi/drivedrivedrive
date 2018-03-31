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

	const authUser = req.user;
	const RequestModel = keystone.list('Request').model;
	const PriceModel = keystone.list('Price').model;
	const queryRequest = RequestModel.findById(locals.filters.requestId);
	// Load the current request
	view.on('init', function (next) {

		queryRequest.exec(function (err, result) {
			// todo: if result null
			if (result.accepted) {
				window.location.reload();
			}
			locals.request = result;
			next(err);
		});

	});

	view.on('post', { action: 'driver.answer.request' }, function(next) {



		const checkIsSubmitedRequest = function() {
			queryRequest.exec(function (err, result) {
				if (result.accepted) {
					window.location.reload();
				} else {
					return true;
				}
			});
		}

		async.series([

			function(cb) {
				const	newPrice = new PriceModel({value: req.body.requestPrice, submitedBy: authUser});

				newPrice.save(function(err) {
					return cb(err);
				});

			},

			function(cb) {
				RequestModel.findOne()
				.where('assignedBy', req.user._id).exec(function (err, result) {
					const answerData = {
						// 'assigned.price': req.body.requestPrice,
						// 'assignedBy': [...result.assignedBy, authUser._id]
						'assignedBy': [authUser._id]
					};
					console.warn(answerData);
					if (checkIsSubmitedRequest()) {
						if (!result) {

						} else {
							new RequestModel().getUpdateHandler(req).process(answerData, {
								fields: 'assignedBy,',
								flashErrors: true
							}, function(err) {
								return cb(err);
							});
						}

					} else {
						return cb(true);
					}
				});
			}

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
