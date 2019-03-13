const keystone = require('keystone');
const {
	apiError,
	compareGuestTimeWithToday,
	sendEmail
} = require('../../lib/helpers');

exports.getGuestRequest = (req, res) => {
	const RequestModel = keystone.list('Request').model;

	RequestModel
		.findOne()
		.where('guest.uniqHash', req.body.hash)
		.exec((err, result) => {
			if (err || !result)
				return apiError(res, { message: 'Невозможно получить данные заявки' }, 400);



			if (compareGuestTimeWithToday(result.guest.date, result.guest.time, 'less')) {
				return res.apiResponse(null);
			}

			return res.apiResponse({
				name: result.guest.name,
				email: result.guest.email,
				count: result.guest.count,
				from: result.guest.from,
				to: result.guest.to,
				date: result.guest.date,
				time: result.guest.time,
				comment: result.guest.comment,
				phone: result.guest.phone
			})
		});
}
exports.updateGuestRequest = (req, res) => {
	const RequestModel = keystone.list('Request').model;
	const UserModel = keystone.list('User').model;

	RequestModel
		.findOne()
		.where('guest.uniqHash', req.body.hash)
		.populate('submitedOn')
		.exec((err, result) => {
			if (err || !result)
				return apiError(res, { message: 'Ошибка сервера' }, 500);

			if (compareGuestTimeWithToday(result.guest.date, result.guest.time, 'less')) {
				return res.apiResponse(null);
			}

			const guestData = {
				guest: {
					name: req.body.name,
					email: req.body.email,
					count: req.body.count,
					from: req.body.from,
					to: req.body.to,
					date: req.body.date,
					time: req.body.time,
					comment: req.body.comment,
					phone: req.body.phone
				},
			};

			result
				.set(guestData)
				.save((err, updatedResult) => {
					if (err)
						return apiError(res, { message: 'Не удалось обновить данные' }, 400);

					UserModel
						.find()
						.where('isAdmin', true)
						.exec((err, users) => {
							if (err)
								console.error('Не удалось найти админов', err);
							let notifiers = result.submitedOn
								? [...users, result.submitedOn]
								: users;
							sendEmail({
								templateName: 'driver-update-request-notify',
								to: notifiers,
								subject: `Трансфер ${updatedResult.guest.from} - ${updatedResult.guest.to}`
							},
							{
								guestData: updatedResult,
								driver: true
							});
							return res.apiResponse();
						})
				});
		});
}