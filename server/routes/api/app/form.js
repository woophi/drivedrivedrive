require('moment/locale/ru');
var async = require('async'),
  keystone = require('keystone'),
		_ = require('lodash'),
	User = keystone.list('User'),
  Gdpr = keystone.list('Gdpr'),
	moment = require('moment'),
	mailFrom = require('../staticVars').mailFrom;
const { getUserIp } = require('./helpers');

exports.sendRequest = (req, res) => {
	if (!req.body.gdpr) {
		return res.apiError({message: 'Без gdpr нельзя' }, '', err, 400);
	}

	let confirmedGDPR;

  const callback = (err) => {
		if (err) {
			console.error('There was an error sending the notification email:', err);
		}
	};

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
    },
		created: Date.now(),
		ip: getUserIp()
  };
  const Request = keystone.list('Request').model;
  let	requestData;
  async.series([

		(cb) => {
      Gdpr.model.findOne()
				.where('keyName', 'gdpr_1')
				.exec((err, result) => {
					if (err) {
						return res.apiError({message: 'Системная ошибка' }, '', err, 500);
					}
					if (!result) {
						return res.apiError({message: 'Извините, согласие не найдено' }, '', err, 404);
					}
					confirmedGDPR = result._id;
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

      User.model.find().where('isActive', true).exec((err, users) => {
        if (err) {
					return res.apiError({message: 'Неудалось найти водителей.' }, '', err, 404);
        }

        if (!_.isEmpty(users)) {
          new keystone.Email({
            templateName: 'driver-notify',
            transport: 'mailgun',
          }).send({
            to: users,
            from: mailFrom,
            subject: 'Новая заявка на трансфер',
            guestData: requestData,
            host: req.headers.origin,
            moment
          }, callback);
          return cb();
        }

        return cb();

      });

    },

  ], (err) => {

    if (err) {
			return res.apiError({message: 'Что-то пошло не так... попробуйте еще раз' }, '', err, 500);
    }

    return res.apiResponse(true);

  });
};
