const async = require('async');
const keystone = require('keystone');
const { isEmpty } = require('lodash');
const {
	getUserIp,
	sendEmail,
	parseDateForWix,
	trimSpaces,
	parseTimeWithMoment
} = require('../../lib/helpers');
const { getGeoData } = require('../../lib/tracking');
const crypto = require('crypto');
const { apiError } = require('../../lib/errorHandle');
const { t } = require('../../resources');

exports.sendRequest = (req, res) => {
	if (!req.body.gdpr) {
		return apiError(res, 400);
	}

	let	requestData;
	let confirmedGDPR;
	let admins;
	let auditId;

	const buf = crypto.randomBytes(128).toString('hex');
  const guestData = {
    guest: {
      name: req.body.name,
      email: trimSpaces(req.body.email.toLowerCase()),
      count: Number(req.body.count),
      from: req.body.from,
      to: req.body.to,
      date: parseDateForWix(req.body.date),
      time: parseTimeWithMoment(req.body.time),
			comment: req.body.comment,
			uniqHash: buf,
			phone: req.body.phone
    },
		created: Date.now()
	};

	const RequestModel = keystone.list('Request').model;
	const AuditModel = keystone.list('Audit').model;
	const UserModel = keystone.list('User').model;
	const GdprModel = keystone.list('Gdpr').model;
  async.series([

		(cb) => {
			GdprModel
				.findOne()
				.where('keyName', 'gdpr_1')
				.exec((err, result) => {
					if (err) {
						return apiError(res, 500, err);
					}
					if (!result) {
						return apiError(res, 404);
					}
					confirmedGDPR = result._id;
					return cb();
				});
    },

    (cb) => {

			UserModel
				.find()
				.where('notifications.email', true)
				.$where('this.isAdmin')
				.exec((err, users) => {
        if (err) {
					return apiError(res, 500, err);
        }
        if (isEmpty(users)) {
					return apiError(res, 404);
				}

				admins = users;

        return cb();

      });

		},

		(cb) => {
			requestData = new RequestModel({
				...guestData,
				confirmedGDPR
			});
      requestData.save((err) => {
        if (err) {
					return apiError(res, 500, err);
        }
        return cb();
      });

		},
		(cb) => {
			const geoData = getGeoData(req);
			const newAudit = new AuditModel({
				ip: getUserIp(req),
				country: geoData.country,
				city: geoData.city,
				language: req.body.lang,
				auditRequest: requestData._id
			});
      newAudit.save((err, audit) => {
        if (err) {
					return apiError(res, 500, err);
				}
				auditId = audit._id;
        return cb();
      });

		},

		(cb) => {
			requestData
				.set({
					audit: auditId
				})
				.save((err) => {
					if (err) {
						return apiError(res, 500, err);
					}
					return cb();
				});
		},

		(cb) => {
			admins.forEach(admin => {
				const emailKeys = {
					templateName: 'admin-notify-new-request',
					to: admin,
					subject: t('mails.subject.adminNewReq', {from:requestData.guest.from,to:requestData.guest.to}, admin.language)
				};

				const params = {
					guestData: requestData,
					driver: true,
					language: admin.language
				};

				sendEmail(emailKeys, params);
			});
			return cb();
		},

		(cb) => {
			// TODO: enum of template names
			const emailKeys = {
				templateName: 'guest-notify-new-request',
				to: trimSpaces(req.body.email.toLowerCase()),
				subject: t('mails.subject.guestNewReq', {from:requestData.guest.from,to:requestData.guest.to}, req.body.lang)
			};

			const params = {
				guestData: requestData,
				uniqHash: requestData.guest.uniqHash,
				language: req.body.lang
			};

			sendEmail(emailKeys, params);
			return cb();
		}

  ], (err) => {

    if (err) {
			return apiError(res, 500, err);
    }

    return res.apiResponse();

  });
};