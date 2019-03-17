const keystone = require('keystone');
const async = require('async');
const Request = keystone.list('Request');

exports = module.exports = (req, res) => {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.language = 'ru';
	try {
		if (req.user) {
			locals.language = req.user.language;
			view.render('default');
		}
		if (!req.user && req.params && req.params.id) {
			async.series([
				(cb) => {
					Request.model
						.findById(req.params.id)
						.populate('audit')
						.exec((err, result) => {
							if (err) {
								return cb(err);
							}
							if (result.audit) {
								locals.language = result.audit.language;
							}
							return cb();
						});
				},

			], (err) => {

				if (err) {
					console.error('Error dunno', err);
				}

				return view.render('default');
			});
		} else {
			view.render('default');
		}
	} catch (error) {
		console.error('unknown error', error);
		view.render('default');
	}
};
