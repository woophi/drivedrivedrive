const async = require('async');
const keystone = require('keystone');
const { apiError } = require('../../lib/helpers');
const { SubStatus } = require('../../lib/staticVars');

exports.subStateDriver = (req, res) => {

	if (!req.user) {
		return res.apiResponse({
      SubStatus: SubStatus.UNAUTHORIZED
    });
	}
	const UserModel = keystone.list('User').model;

	UserModel.findById(req.user._id).exec((err, user) => {

		if (err || !user) {
			return apiError(res, {message: 'Ошибка сервера' }, 500);
		}

		if (!user.notifications.email) {
			return res.apiResponse({
				message: 'Водитель уже отписался от почтовой рассылки',
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
					return apiError(res, {message: 'Ошибка сервера' }, 500);
				}

				if (!user.notifications.email) {
					return res.apiResponse({
						message: 'Водитель уже отписался от почтовой рассылки',
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
			return apiError(res, {message: 'Не удалось обновить статус почтовой рассылки' }, 500);
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
		.exec((err, result) => {

			if (err) {
				return apiError(res, {message: 'Ошибка сервера' }, 500);
			}

			if (!result) {
				return res.apiResponse({
					SubStatus: SubStatus.FORBIDDEN
				});
			}

			if (!result.guest.notify) {
				return res.apiResponse({
					message: 'Пользователь уже отписался от почтовой рассылки',
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

	async.series([

		(cb) => {
			const RequestModel = keystone.list('Request').model;

			RequestModel
				.findOne()
				.where('guest.uniqHash', req.body.hash)
				.exec((err, result) => {

					if (err) {
						return apiError(res, {message: 'Ошибка сервера' }, 500);
					}

					if (!result) {
						return res.apiResponse({
							SubStatus: SubStatus.FORBIDDEN
						});
					}

					if (!result.guest.notify) {
						return res.apiResponse({
							message: 'Пользователь уже отписался от почтовой рассылки',
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
			return apiError(res, {message: 'Не удалось обновить статус почтовой рассылки' }, 500);
		}

		return res.apiResponse({
      SubStatus: SubStatus.DONE
    });
  });

};