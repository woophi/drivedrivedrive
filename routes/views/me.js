var keystone = require('keystone'),
	_ = require('lodash');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'me';

	function callback (err) {
		if (err) {
			console.error('There was an error sending the notification email:', err);
		}
	};

	view.on('post', { action: 'profile.details' }, function(next) {

		const notificationsEmail = !!req.body['notifications.email'];
		const redefinedBody = {
			'notifications.email': notificationsEmail,
			...req.body
		};
		req.user.getUpdateHandler(req).process(redefinedBody, {
			fields: 'name, email, phone,' +
			'photoFront, photoSide, photoInside, driverPhoto, car.kind,' +
			'car.model, car.year, notifications.email',
			flashErrors: true
		}, function(err) {

			const requiredUser = (!!req.user.photoFront.public_id
				&& !!req.user.photoSide.public_id
				&& !!req.user.photoInside.public_id && !!req.user.driverPhoto.public_id
				&& !req.user.isActive && !!req.user.notifications.email
				&& !!req.user.car.model && !!req.user.car.year && !!req.user.car.kind
			);

			if (requiredUser) {
				keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
					if (err) return callback(err);
					new keystone.Email({
						templateName: 'admin-notify',
						transport: 'mailgun',
					}).send({
						to: admins,
						from: {
							name: 'DRIVE SUKA DRIVE',
							email: 'postmaster@sandboxdae723c3f3084598b74d3512385ba33b.mailgun.org',
						},
						subject: 'New driver',
						user: req.user,
						host: req.headers.origin
					}, callback);
				});
			}

			if (err) {
				return next();
			}

			req.flash('success', 'Your changes have been saved.');
			return next();

		});

	});

	view.on('post', { action: 'profile.password' }, function(next) {

		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Please enter a password.');
			return next();
		}

		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'password',
			flashErrors: true
		}, function(err) {

			if (err) {
				return next();
			}

			req.flash('success', 'Your changes have been saved.');
			return next();

		});

	});

	view.render('me');

}
