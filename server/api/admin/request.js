const keystone = require('keystone');
const { apiError, sendEmail } = require('../../lib/helpers');
const async = require('async');
const { isEmpty } = require('lodash');
const { t } = require('../../resources');

exports.getRequest = (req, res) => {
	keystone.list('Request').model
		.findById(req.body.requestId)
		.exec((err, request) => {
			if (err)
				return apiError(res, {message: t('errors.unableToGet', {}, req.user.language) }, 500);
			if (!request)
				return apiError(res, {message: t('errors.request.notFound', {}, req.user.language) }, 404);

			return res.apiResponse(request);
		});
}
exports.updateRequest = (req, res) => {
	const { requestId, ...body } = req.body;
	const payload = {
		guest: body.data
	};
	keystone.list('Request').model
		.findById(requestId)
		.exec((err, request) => {
			if (err)
				return apiError(res, {message: t('errors.unableToGet', {}, req.user.language) }, 500);
			if (!request)
				return apiError(res, {message: t('errors.request.notFound', {}, req.user.language) }, 404);

			request
				.set(payload)
				.save((err) => {
					if (err)
						return apiError(res, { message: t('errors.unableToUpdate', {}, req.user.language) }, 400);

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
						return apiError(res, {message: t('errors.unableToGet', {}, user.language) }, 500);
					if (!request)
						return apiError(res, {message: t('errors.request.notFound', {}, user.language) }, 404);
					if (request.approved)
						return apiError(res, {message: t('errors.request.alreadyApproved', {}, user.language) }, 200);

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
					return apiError(res, {message: t('errors.request.newApproval', {}, user.language) }, 500);
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
						return apiError(res, {message: t('errors.request.addApproval', {}, user.language) }, 500);
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
						return apiError(res, {message:  t('errors.system', {}, user.language)}, 500);
					}
					if (isEmpty(drivers)) {
						return apiError(res, {message: t('errors.user.driver.notFound', {}, user.language) }, 404);
					}

					drivers.forEach(driver => {
						const emailKeys = {
							templateName: 'driver-notify',
							to: driver,
							subject: t('mails.subject.driverNewReq', {from: curRequest.guest.from, to:curRequest.guest.to}, driver.language)
						};

						const params = {
							guestData: curRequest,
							language: driver.language,
							driver: true
						};

						sendEmail(emailKeys, params);
					});

					return cb();
				});
		}

  ], (err) => {

    if (err) {
			return apiError(res, {message: t('errors.unknown', {}, user.language) }, 500);
    }

    return res.apiResponse();

  });

}