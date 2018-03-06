var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {

	// if (req.user) {
	// 	return res.redirect(req.cookies.target || '/me');
	// }

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'session';
	locals.form = req.body;

	view.on('post', { action: 'join' }, function(next) {

		async.series([

			function(cb) {

				if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.phone) {
					req.flash('error', 'Все поля обязательны к заполнению');
					return cb(true);
				}

				return cb();

			},

			function(cb) {

				keystone.list('User').model.findOne({ email: req.body.email }, function(err, user) {

					if (err || user) {
						req.flash('error', 'Пользователь с таким email уже существует');
						return cb(true);
					}

					return cb();

				});

			},

			function(cb) {

				var userData = {
					name: {
						first: req.body.firstname,
						last: req.body.lastname,
					},
					email: req.body.email,
					password: req.body.password,
					phone: req.body.phone
				};

				var User = keystone.list('User').model,
					newUser = new User(userData);

				newUser.save(function(err) {
					return cb(err);
				});

			}

		], function(err){

			if (err) return next();

			var onSuccess = function() {
				// if (req.body.target && !/join|signin/.test(req.body.target)) {
				// 	console.log('[join] - Set target as [' + req.body.target + '].');
				// 	res.redirect(req.body.target);
				// } else {
				// 	res.redirect('/me');
				// }
				res.redirect(req.body.target)
			}

			var onFail = function(e) {
				req.flash('error', 'There was a problem signing you in, please try again.');
				return next();
			}

			//TODO: release it in future
			// keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
			onSuccess();

		});

	});

	view.render('session/join');

}
