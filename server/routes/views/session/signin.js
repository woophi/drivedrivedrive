var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {

	if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}

	var view = new keystone.View(req, res),
		locals = res.locals;

	const	User = keystone.list('User');

	locals.section = 'session';
	locals.form = req.body;

	const redirectSave = req.session.redirectTo;

	view.on('post', { action: 'signin' }, function(next) {

		if (!req.body.email || !req.body.password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}
		async.series([

			function(cb) {

				User.model.findOne().where('email', req.body.email).exec(function(err, user) {
					if (err) return cb(err);
					if (!user) {
						req.flash('error', "Sorry, user not found");
						return cb();
					} else {
						let result = user;
						result.resetPasswordKey = '';
						result.save(function(err) {
							if (err) return cb(err);
							return cb();
						});
					}
				});
			}
		], function(err) {

			var onSuccess = function() {
				if (redirectSave, redirectSave && !/join|signin/.test(redirectSave)) {
					res.redirect(`${redirectSave}`);
				} else {
					res.redirect('/me');
				}
			}

			var onFail = function() {
				req.flash('error', 'Your username or password were incorrect, please try again.');
				return next();
			}

			keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
		});
	});

	view.render('session/signin');

}
