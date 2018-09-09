
var async = require('async'),
  keystone = require('keystone'),
	User = keystone.list('User'),
	Gdpr = keystone.list('Gdpr');
const { isEmpty } = require('lodash');
const { getUserIp, sendEmail } = require('../../lib/helpers');
const crypto = require('crypto');
const { checkMails } = require('../../lib/checkMail');

exports.sendRequest = (req, res) => {
	if (!req.body.gdpr) {
		return res.apiError({message: 'Без gdpr нельзя' }, {message: 'Без gdpr нельзя' }, null, 400);
	}

	let	requestData;
	let confirmedGDPR;
	let drivers;

	const buf = crypto.randomBytes(8).toString('hex');

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
			uniqHash: buf
    },
		created: Date.now(),
		ip: getUserIp(req)
  };
  const Request = keystone.list('Request').model;
  async.series([

		(cb) => {
      Gdpr.model.findOne()
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

			User.model.find()
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
			requestData = new Request({
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
					subject: 'Новая заявка на трансфер'
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

    return res.apiResponse(true);

  });
};

exports.checkEmailAddress = (req, res) => {
	if (!req.body.email)
		return res.apiResponse();
	return checkMails(req.body.email, res)
}
