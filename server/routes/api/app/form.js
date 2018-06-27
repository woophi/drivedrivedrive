var async = require('async'),
  keystone = require('keystone'),
		_ = require('lodash'),
	User = keystone.list('User'),
  Gdpr = keystone.list('Gdpr'),
  moment = require('moment'),
  mailFrom = require('../staticVars').mailFrom;

exports.sendRequest = function(req, res) {
	if (!req.body.gdpr) {
		return res.apiError({message: 'Без gdpr нельзя' }, '', err, 400);
	}

	let confirmedGDPR;

  function callback (err) {
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
		created: Date.now()
  };
  const Request = keystone.list('Request').model;
  let	requestData;
  async.series([

		function(cb) {
      Gdpr.model.findOne()
				.where('keyName', 'gdpr_1')
				.exec(function (err, result) {
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


    function(cb) {
			requestData = new Request({
				...guestData,
				confirmedGDPR
			});
      requestData.save(function(err) {
        if (err) {
          console.error(err);
          return res.apiError({
            message: 'Проблема создать новый запрос.'
          });
        }
        return cb();
      });

    },

    function(cb) {

      User.model.find().where('isActive', true).exec(function(err, users) {
        if (err) {
          console.error(err);
          return res.apiError({
            message: 'Неудалось найти водителей.'
          });
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

  ], function(err){

    if (err) {
      console.error(err);
      return res.apiError({
        message: (err && err.message ? err.message : false) || 'Что-то пошло не так... попробуйте еще раз'
      });
    }

    return res.apiResponse(true);

  });
};
