const async = require('async');
const keystone = require('keystone');
const { isEmpty } = require('lodash');
const { getUserIp, sendEmail, parseDateForWix, trimSpaces, parseTimeForWix } = require('../../lib/helpers');
const crypto = require('crypto');
const { checkMails } = require('../../lib/checkMail');

exports.sendRequest = (req, res) => {
	if (!req.body.gdpr) {
		return res.apiError({message: 'Без gdpr нельзя' }, {message: 'Без gdpr нельзя' }, null, 400);
	}

	let	requestData;
	let confirmedGDPR;
	let drivers;

	const buf = crypto.randomBytes(128).toString('hex');
  const guestData = {
    guest: {
      name: req.body.name,
      email: trimSpaces(req.body.email.toLowerCase()),
      count: Number(req.body.count),
      from: req.body.from,
      to: req.body.to,
      date: parseDateForWix(req.body.date),
      time: parseTimeForWix(req.body.time),
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
						return res.apiError({message: 'Системная ошибка' }, '', err, 500);
					}
					if (!result) {
						return res.apiError({message: 'Извините, согласие не найдено' }, '', null, 404);
					}
					confirmedGDPR = result._id;
					return cb();
				});
    },

    (cb) => {

			UserModel
				.find()
				.where('isActive', true)
				.where('notifications.email', true)
				.exec((err, users) => {
        if (err) {
					return res.apiError({message: 'Системная ошибка.' }, '', err, 500);
        }
        if (isEmpty(users)) {
					return res.apiError({message: 'Не удалось найти водителей.' }, '', null, 404);
				}

				drivers = users;

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
					return res.apiError({message: 'Проблема создать новый запрос.' }, '', err, 500);
        }
        return cb();
      });

		},

		(cb) => {
			if (!isEmpty(drivers)) {
				const emailKeys = {
					templateName: 'driver-notify',
					to: drivers,
					subject: `Новая заявка на трансфер из ${requestData.guest.from} в ${requestData.guest.to}`
				};

				const params = {
					guestData: requestData,
					driver: true
				};

				sendEmail(emailKeys, params);
				return cb();
			}
			return cb();
		}

  ], (err) => {

    if (err) {
			return res.apiError({message: 'Что-то пошло не так... попробуйте еще раз' }, '', err, 500);
    }

    return res.apiResponse(buf);

  });
};

exports.checkEmailAddress = (req, res) => {
	if (!req.body.email)
		return res.apiResponse();
	return checkMails(req.body.email, res)
}
