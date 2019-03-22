const keystone = require('keystone');
const { sendEmail } = require('../../lib/helpers');
const async = require('async');
const { isEmpty } = require('lodash');
const { t } = require('../../resources');
const { apiError } = require('../../lib/errorHandle');

exports.getRequest = (req, res) => {
	keystone.list('Request').model
		.findById(req.body.requestId)
		.exec((err, request) => {
			if (err)
				return apiError(res, 500, err);

			if (!request)
				return apiError(res, 404);

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
				return apiError(res, 500, err);
			if (!request)
				return apiError(res, 404);

			request
				.set(payload)
				.save((err) => {
					if (err)
						return apiError(res, 400, err);

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
						return apiError(res, 500, err);
					if (!request)
						return apiError(res, 404);
					if (request.approved)
						return apiError(res, 200);

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
					return apiError(res, 500, err);
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
						return apiError(res, 500, err);
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
						return apiError(res, 500, err);
					}
					if (isEmpty(drivers)) {
						return apiError(res, 404);
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
			return apiError(res, 500, err);
    }

    return res.apiResponse();

  });

}