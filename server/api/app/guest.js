const keystone = require('keystone');
const {
	compareGuestTimeWithToday,
	sendEmail
} = require('../../lib/helpers');
const { apiError } = require('../../lib/errorHandle');
const { t } = require('../../resources');

exports.getGuestRequest = (req, res) => {
	const RequestModel = keystone.list('Request').model;

	RequestModel
		.findOne()
		.where('guest.uniqHash', req.body.hash)
		.exec((err, result) => {
			if (err || !result)
				return apiError(res, 400, err);



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
				return apiError(res, 400, err);

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
						return apiError(res, 400, err);

					UserModel
						.find()
						.where('isAdmin', true)
						.exec((err, users) => {
							if (err)
								console.error('Не удалось найти админов', err);
							let notifiers = result.submitedOn
								? [...users, result.submitedOn]
								: users;
							notifiers.forEach(notifier => {

								sendEmail({
									templateName: 'driver-update-request-notify',
									to: notifier,
									subject: t('mails.subject.guestUpdateReq', {from:updatedResult.guest.from,to:updatedResult.guest.to}, notifier.language)
								},
								{
									guestData: updatedResult,
									driver: true,
									language: notifier.language
								});
							});
							return res.apiResponse();
						})
				});
		});
}