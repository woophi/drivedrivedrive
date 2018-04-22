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

	locals.initRatingValue = 0;

	const RequestModel = keystone.list('Request').model;
	const RatingModel = keystone.list('Rating').model;
	const UserModel = keystone.list('User').model;

	function callback (err) {
		if (err) {
			console.error('There was an error sending the notification email:', err);
		}
	};

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
				}, callback);
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

		if (locals.stateOfRequest === 'invalid') {
			req.flash('warning', 'Ссылка на рейтинг не активна');
			return next();
		} else if (locals.stateOfRequest === 'failed') {
			req.flash('warning', 'Что-то пошло не так...');
			return next();
		}

		if (parseInt(req.body.ratingValue) === 0) {
			req.flash('error', "Пожалуйста, оцените водителя.");
			return next();
		}
		if (parseInt(req.body.ratingValue) <= 3 && !req.body.ratingComment) {
			locals.initRatingValue = req.body.ratingValue;
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
							'value': req.body.ratingValue,
							'comment': req.body.ratingComment,
							'closed': Date.now()
						};

						resultRating.getUpdateHandler(req).process(updateData, {
							fields: 'value, comment, closed,',
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
