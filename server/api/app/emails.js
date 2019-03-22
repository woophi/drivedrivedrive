const async = require('async');
const keystone = require('keystone');
const { apiError } = require('../../lib/errorHandle');
const { SubStatus } = require('../../lib/staticVars');
const { t } = require('../../resources');

exports.subStateDriver = (req, res) => {

	if (!req.user) {
		return res.apiResponse({
      SubStatus: SubStatus.UNAUTHORIZED
    });
	}
	const UserModel = keystone.list('User').model;

	UserModel.findById(req.user._id).exec((err, user) => {

		if (err || !user) {
			return apiError(res, 500, err);
		}

		if (!user.notifications.email) {
			return res.apiResponse({
				message: t('errors.user.driver.notSub', {}, req.user.language),
				SubStatus: SubStatus.INVALID
			});
		}

		return res.apiResponse({
			SubStatus: SubStatus.PROCESS
		});
	});

}

exports.unsubDriver = (req, res) => {
	if (!req.user) {
		return res.apiResponse({
      SubStatus: SubStatus.UNAUTHORIZED
    });
	}

	async.series([

		(cb) => {
			const UserModel = keystone.list('User').model;

			UserModel.findById(req.user._id).exec((err, user) => {

				if (err || !user) {
					return apiError(res, 400, err);
				}

				if (!user.notifications.email) {
					return res.apiResponse({
						message: t('errors.user.driver.notSub', {}, req.user.language),
						SubStatus: SubStatus.INVALID
					});
				}

				user.notifications.email = false;
				user.save((err) => {
					if (err) {
						return cb(err);
					}
					return cb();
				});
			});
		}
  ], (err) => {

    if (err) {
			return apiError(res, 500, err);
		}

		return res.apiResponse({
      SubStatus: SubStatus.DONE
    });
  });

};
exports.subStateGuest = (req, res) => {

	if (!req.body.hash) {
		return res.apiResponse({
      SubStatus: SubStatus.FORBIDDEN
    });
	}
	const RequestModel = keystone.list('Request').model;

	RequestModel
		.findOne()
		.where('guest.uniqHash', req.body.hash)
		.populate('audit')
		.exec((err, result) => {

			if (err) {
				return apiError(res, 500, err);
			}

			if (!result) {
				return res.apiResponse({
					SubStatus: SubStatus.FORBIDDEN
				});
			}

			if (!result.guest.notify) {
				return res.apiResponse({
					message: t('errors.user.guest.notSub', {}, result.audit.language),
					SubStatus: SubStatus.INVALID
				});
			}

			return res.apiResponse({
				SubStatus: SubStatus.PROCESS
			});
		});

}

exports.unsubGuest = (req, res) => {
	if (!req.body.hash) {
		return res.apiResponse({
      SubStatus: SubStatus.UNAUTHORIZED
    });
	}

	let language;
	async.series([

		(cb) => {
			const RequestModel = keystone.list('Request').model;

			RequestModel
				.findOne()
				.where('guest.uniqHash', req.body.hash)
				.populate('audit')
				.exec((err, result) => {
					if (err) {
						return apiError(res, 500, err);
					}

					if (!result) {
						return res.apiResponse({
							SubStatus: SubStatus.FORBIDDEN
						});
					}

					if (!result.guest.notify) {
						return res.apiResponse({
							message: t('errors.user.guest.notSub', {}, result.audit.language),
							SubStatus: SubStatus.INVALID
						});
					}

					result.guest.notify = false;
					result.save((err) => {
						if (err) {
							return cb(err);
						}
						return cb();
					});
				});
		}
  ], (err) => {

    if (err) {
			return apiError(res, 500, err);
		}

		return res.apiResponse({
      SubStatus: SubStatus.DONE
    });
  });

};