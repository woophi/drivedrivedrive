const keystone = require('keystone');
const { apiError, sendEmail } = require('../../lib/helpers');
const async = require('async');
const { isEmpty } = require('lodash');

exports.getRequest = (req, res) => {
	keystone.list('Request').model
		.findById(req.body.requestId)
		.exec((err, request) => {
			if (err)
				return apiError(res, {message: 'Невозможно получить данные' }, 500);
			if (!request)
				return apiError(res, {message: 'Заявка не найдена' }, 404);

			return res.apiResponse(request);
		});
}
exports.updateRequest = (req, res) => {
	const { requestId, ...body } = req.body;
	const payload = {
		...body
	};
	keystone.list('Request').model
		.findById(requestId)
		.exec((err, request) => {
			if (err)
				return apiError(res, {message: 'Невозможно получить данные' }, 500);
			if (!request)
				return apiError(res, {message: 'Заявка не найдена' }, 404);

			request
				.set(payload)
				.save((err) => {
					if (err)
						return apiError(res, { message: 'Не удалось обновить данные' }, 400);

					return res.apiResponse();
				});
		});
}

exports.approveRequest = (req, res) => {
	const user = req.user;
	const requestId = req.body.requestId;
	const ApprovalModel = keystone.list('Approval').model;
	let curRequest;
	let savedAprovalId;
	async.series([

		(cb) => {
			keystone.list('Request').model
				.findById(requestId)
				.exec((err, request) => {
					if (err)
						return apiError(res, {message: 'Невозможно получить данные' }, 500);
					if (!request)
						return apiError(res, {message: 'Заявка не найдена' }, 404);
					if (request.approved)
						return apiError(res, {message: 'Заявка уже одобрена' }, 200);

					curRequest = request;
					return cb();
				});
    },

    (cb) => {
			const newApproval = new ApprovalModel({
				approvedBy: user._id,
				approvedRequest: curRequest._id,
				approvedTime: Date.now()
			});
			newApproval.save((err, result) => {
        if (err) {
					return apiError(res, {message: 'Проблема создать нового одобряющего' }, 500);
				}
				savedAprovalId = result._id;
        return cb();
      });
		},

		(cb) => {
			curRequest
				.set({
					approved: savedAprovalId
				})
				.save((err) => {
					if (err) {
						return apiError(res, {message: 'Проблема добавить одобряющего к заявке' }, 500);
					}
					return cb();
				});
		},

		(cb) => {
			keystone.list('User').model
				.find()
				.where('notifications.email', true)
				.where('isActive', true)
				.exec((err, drivers) => {
					if (err) {
						return apiError(res, {message: 'Системная ошибка' }, 500);
					}
					if (isEmpty(drivers)) {
						return apiError(res, {message: 'Не удалось найти водителей.' }, 404);
					}

					const emailKeys = {
						templateName: 'driver-notify',
						to: drivers,
						subject: `Новая заявка на трансфер из ${curRequest.guest.from} в ${curRequest.guest.to}`
					};

					const params = {
						guestData: curRequest,
						driver: true
					};

					sendEmail(emailKeys, params);
					return cb();
				});
		}

  ], (err) => {

    if (err) {
			return apiError(res, {message: 'Что-то пошло не так... попробуйте еще раз' }, 500);
    }

    return res.apiResponse();

  });

}