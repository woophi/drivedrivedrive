const async = require('async');
const keystone = require('keystone');
const User = keystone.list('User');

exports.subStateDriver = (req, res) => {

	if (!req.user) {
		return res.apiResponse({
      SubStatus: -1
    });
	}

	User.model.findById(req.user._id).exec((err, user) => {

		if (err || !user) {
			return res.apiError({
				message: 'Ошибка сервера'
			}, '', err ? err : null, 500);
		}

		if (!user.notifications.email) {
			return res.apiResponse({
				message: 'Водитель уже отписался от почтовой рассылки',
				SubStatus: 0
			});
		}

		return res.apiResponse({
			SubStatus: 2
		});
	});

}

exports.unsubDriver = (req, res) => {
	if (!req.user) {
		return res.apiResponse({
      SubStatus: -1
    });
	}

	async.series([

		(cb) => {
			User.model.findById(req.user._id).exec((err, user) => {

				if (err || !user) {
					return res.apiError({
						message: 'Ошибка сервера'
					}, '', err ? err : null, 500);
				}

				if (!user.notifications.email) {
					return res.apiResponse({
						message: 'Водитель уже отписался от почтовой рассылки',
						SubStatus: 0
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
			return res.apiError({
        message: 'Не удалось обновить статус почтовой рассылки'
      }, '', err, 500);
		}

		return res.apiResponse({
      SubStatus: 1
    });
  });

};