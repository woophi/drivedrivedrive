const async = require('async');
const keystone = require('keystone');
const { isEmpty } = require('lodash');
const {
	getUserIp,
	sendEmail,
	parseDateForWix,
	trimSpaces,
	apiError
} = require('../../lib/helpers');
const crypto = require('crypto');
const { checkMails } = require('../../lib/checkMail');

exports.sendRequest = (req, res) => {
	if (!req.body.gdpr) {
		return apiError(res, {message: 'Без gdpr нельзя' }, 400);
	}

	let	requestData;
	let confirmedGDPR;
	let admins;

	const buf = crypto.randomBytes(128).toString('hex');
  const guestData = {
    guest: {
      name: req.body.name,
      email: trimSpaces(req.body.email.toLowerCase()),
      count: Number(req.body.count),
      from: req.body.from,
      to: req.body.to,
      date: parseDateForWix(req.body.date),
      time: req.body.time,
			comment: req.body.comment,
			uniqHash: buf,
			phone: req.body.phone
    },
		created: Date.now(),
		ip: getUserIp(req)
	};

	const RequestModel = keystone.list('Request').model;
	const UserModel = keystone.list('User').model;
	const GdprModel = keystone.list('Gdpr').model;
  async.series([

		(cb) => {
			GdprModel
				.findOne()
				.where('keyName', 'gdpr_1')
				.exec((err, result) => {
					if (err) {
						return apiError(res, {message: 'Системная ошибка' }, 500);
					}
					if (!result) {
						return apiError(res, {message: 'Извините, согласие не найдено' }, 404);
					}
					confirmedGDPR = result._id;
					return cb();
				});
    },

    (cb) => {

			UserModel
				.find()
				.where('notifications.email', true)
				.$where('this.isAdmin || this.isSuperAdmin')
				.exec((err, users) => {
        if (err) {
					return apiError(res, {message: 'Системная ошибка' }, 500);
        }
        if (isEmpty(users)) {
					return apiError(res, {message: 'Не удалось найти админов.' }, 404);
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
					return apiError(res, {message: 'Проблема создать новый запрос.' }, 500);
        }
        return cb();
      });

		},

		(cb) => {
			const emailKeys = {
				templateName: 'admin-notify-new-request',
				to: admins,
				subject: `Новая заявка на трансфер из ${requestData.guest.from} в ${requestData.guest.to}`
			};

			const params = {
				guestData: requestData,
				driver: true
			};

			sendEmail(emailKeys, params);
			return cb();
		}

  ], (err) => {

    if (err) {
			return apiError(res, {message: 'Что-то пошло не так... попробуйте еще раз' }, 500);
    }

    return res.apiResponse();

  });
};

exports.checkEmailAddress = (req, res) => {
	if (!req.body.email)
		return res.apiResponse();
	return checkMails(req.body.email, res)
}
