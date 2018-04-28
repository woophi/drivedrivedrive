var keystone = require('keystone'),
		async = require('async'),
		_ = require('lodash'),
		moment = require('moment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'rateRequest';
	locals.form = req.body;
	locals.filters = {
		requestId: req.params.id,
	};
	locals.stateOfRequest = 'open';

	locals.initRatings = {
		trip: 0,
		driver: 0,
		car: 0,
		comment: ''
	};

	const RequestModel = keystone.list('Request').model;
	const RatingModel = keystone.list('Rating').model;
	const UserModel = keystone.list('User').model;

	function calculateRating (newRating, ratings) {
		var Ad = newRating.values.driver;
		var Ac = newRating.values.car;
		var At = newRating.values.trip;
		var SI = 2.5;
		Ad = Ad === 1 && At === 1 || Ad === 1 && Ac === 1 || Ac === 1 && At === 1 ?
			Ad + SI : Ad;
		var R = (Ad + Ac + At) / 3;
		var newCounter = ratings.count + 1;
		var oldRealValue = ratings.realValue;
		var Sum = oldRealValue * ratings.count;

		var realValue = (Sum + R) / newCounter;
		var nominalValue = newCounter > 3 ? Math.ceil(realValue) : ratings.nominalValue;

		return { realValue, nominalValue };
	}

	function rateDriver (next) {
		RequestModel
			.findById(locals.filters.requestId)
			.populate('assignedRating')
			.populate('submitedOn')
			.exec(function(err, result) {
				if (err) return next(err);
				UserModel
					.findById(result.submitedOn._id)
					.exec(async function(err, userResult) {
						if (err) return next(err);

						const assignedRatingsConc = userResult.rating.assignedRatings ?
							[...userResult.rating.assignedRatings, result.assignedRating._id ] :
							[ result.assignedRating._id ];

						const { realValue, nominalValue } = await calculateRating(result.assignedRating, userResult.rating);

						const newCount = userResult.rating.count + 1;

						const updateData = {
							'rating.nominalValue': nominalValue,
							'rating.realValue': realValue,
							'rating.count': newCount,
							'rating.assignedRatings': assignedRatingsConc
						};

						userResult.getUpdateHandler(req).process(updateData, {
							fields: 'rating.nominalValue, rating.realValue, rating.count, rating.assignedRatings,',
							flashErrors: true
						}, err => err && next(err));

					});
			});
	}

	function oneRatingLOEThree () {
		if (parseInt(req.body.ratingDriver) <= 3 ||
				parseInt(req.body.ratingTrip) <= 3 ||
				parseInt(req.body.ratingCar) <= 3) {
			return true;
		} else {
			return false;
		}
	}

	function sentMail(result) {
		UserModel
			.findOne()
			.where('isAdmin', true)
			.exec(function(err, resultAdmin) {
				new keystone.Email({
					templateName: 'rate-request-notify-admin',
					transport: 'mailgun',
				}).send({
					to: resultAdmin,
					from: {
						name: 'DRIVE SUKA DRIVE',
						email: 'postmaster@sandboxdae723c3f3084598b74d3512385ba33b.mailgun.org',
					},
					subject: `Оценка трансфера ${result.guest.from} - ${result.guest.to}`,
					data: result,
					moment,
					host: req.headers.origin
				}, err => err && console.error(err));
			});
	};

	view.on('init', function(next) {
		RequestModel.findById(locals.filters.requestId)
			.populate('assignedRating')
			.exec(function (err, result) {
				if (result.assignedRating && !result.assignedRating.closed) {
					locals.stateOfRequest = 'open';
				} else if (result.assignedRating && result.assignedRating.closed) {
					locals.stateOfRequest = 'invalid';
				} else {
					locals.stateOfRequest = 'failed';
				}
			})
			.then(() => next());
	});

	view.on('post', { action: 'guest.rate.request' }, function(next) {
			locals.initRatings.car = req.body.ratingCar;
			locals.initRatings.trip = req.body.ratingTrip;
			locals.initRatings.driver = req.body.ratingDriver;
			locals.initRatings.comment = req.body.ratingComment;

		if (locals.stateOfRequest === 'invalid') {
			req.flash('warning', 'Ссылка на рейтинг не активна');
			return next();
		} else if (locals.stateOfRequest === 'failed') {
			req.flash('warning', 'Что-то пошло не так...');
			return next();
		}

		if (parseInt(req.body.ratingDriver) === 0) {
			req.flash('error', "Пожалуйста, оцените водителя.");
			return next();
		}
		if (parseInt(req.body.ratingTrip) === 0) {
			req.flash('error', "Пожалуйста, оцените поездку.");
			return next();
		}
		if (parseInt(req.body.ratingCar) === 0) {
			req.flash('error', "Пожалуйста, оцените машину.");
			return next();
		}
		if (oneRatingLOEThree() && !req.body.ratingComment) {
			req.flash('warning', 'Пожалуйста, оставьте свой комментарий.');
			return next();
		}

		async.series([

			function(cb) {
				RatingModel
					.findOne()
					.where('assignedRequest', locals.filters.requestId)
					.exec(function (err, resultRating) {
						if (err) return cb(err);

						const updateData = {
							'values.trip': req.body.ratingTrip,
							'values.driver': req.body.ratingDriver,
							'values.car': req.body.ratingCar,
							'comment': req.body.ratingComment,
							'closed': Date.now()
						};

						resultRating.getUpdateHandler(req).process(updateData, {
							fields: 'values.trip, values.driver, values.car, comment, closed,',
							flashErrors: true
						}, function(err) {
							return cb(err);
						});
					});
			},

			function (cb) {
				RequestModel
					.findById(locals.filters.requestId)
					.populate('assignedRating')
					.populate('submitedOn')
					.exec(function(err, result) {
						if (err) return cb(err);

						const updateData = {
							'rated': true
						};

						result.getUpdateHandler(req).process(updateData, {
							fields: 'rated,',
							flashErrors: true
						}, function(err) {
							sentMail(result);
							return cb(err);
						});
					});
			}

		], function(err){

			var onSuccess = function(err) {
				req.flash('success', 'Спасибо за вашу оценку');
				locals.stateOfRequest = 'done';
				rateDriver(next);
				return next(err)
			}

			var onFail = function(err) {
				req.flash('error', 'Что-то пошло не так... попробуйте еще раз');
				return next(err);
			}
			if (err) onFail(err);

			onSuccess(err);

		});

	});

	// Render the view
	view.render('rateRequest');
};
