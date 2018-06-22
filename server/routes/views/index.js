var keystone = require('keystone'),
		async = require('async'),
		_ = require('lodash'),
		moment = require('moment');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	res.render('default', {}, (e, html) => {
		const testReplace = html.replace('ALESHA', '<div>hui</div>');
		console.warn(testReplace)
		res.send(testReplace);
	})
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.form = req.body;

	function callback (err) {
		if (err) {
			console.error('There was an error sending the notification email:', err);
		}
	};

	view.on('post', { action: 'guest.send.request' }, function(next) {

		const guestData = {
			guest: {
				name: req.body.guestName,
				email: req.body.guestEmail,
				count: req.body.guestCount,
				from: req.body.guestFrom,
				to: req.body.guestTo,
				date: req.body.guestDate,
				time: req.body.guestTime,
				comment: req.body.guestComment,
			},
			created: Date.now()
		};
		const Request = keystone.list('Request').model;
		const	newRequest = new Request(guestData);
		async.series([

			function(cb) {
				newRequest.save(function(err) {
					return cb(err);
				});

			},

			function(cb) {

				keystone.list('User').model.find().where('isActive', true).exec(function(err, users) {

					if (!_.isEmpty(users)) {
						new keystone.Email({
							templateName: 'driver-notify',
							transport: 'mailgun',
						}).send({
							to: users,
							from: {
								name: 'DRIVE SUKA DRIVE',
								email: 'postmaster@sandboxdae723c3f3084598b74d3512385ba33b.mailgun.org',
							},
							subject: 'New request',
							guestData: newRequest,
							host: req.headers.origin,
							moment
						}, callback);
						return cb();
					}

					return cb();

				});

			},

		], function(err){

			var onSuccess = function() {
				req.flash('success', 'Ваша заявка отправлена');
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
	// view.render('default');
};
