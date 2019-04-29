const keystone = require('keystone');
const async = require('async');
const Request = keystone.list('Request');

exports = module.exports = (req, res) => {
	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.language = 'ru';
	const redirectedLanguage = req.query['language'];
	if (redirectedLanguage) {
		locals.language = redirectedLanguage;
	}
	try {
		if (req.user) {
			locals.language = req.user.language;
			renderPage(locals.language, view);
		}
		if (!req.user && req.params && req.params.id) {
			async.series([
				(cb) => {
					try {
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
					} catch (error) {
						return cb(error);
					}
				},

			], (err) => {

				if (err) {
					console.error('Error dunno', err);
				}

				return renderPage(locals.language, view);
			});
		} else if (!req.user) {
			renderPage(locals.language, view);
		}
	} catch (error) {
		console.error('unknown error', error);
		renderPage(locals.language, view);
	}
};

const renderPage = (lang, view) => {
	if (lang === 'ru') {
		return view.render('default');
	} else {
		return view.render('defaultEN');
	}
}
