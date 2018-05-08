var async = require('async'),
  keystone = require('keystone'),
		_ = require('lodash'),
  User = keystone.list('User'),
  moment = require('moment'),
  mailFrom = require('../staticVars').mailFrom,
  Request = keystone.list('Request'),
	Price = keystone.list('Price');

exports.getRequestState = function(req, res) {
  if (!req.user) {
		return res.apiResponse({
      Rstatus: -1
    });
	} else if (req.user && !req.user.isActive) {
		return res.apiResponse({
      Rstatus: -2
    });
	}

  Request.model.findById(req.body.requestId)
    .where('assignedBy', req.body.userId)
    .exec(function (err, result) {
      if (err) return res.apiError(null);
      if (result && result.submitedOn) {
        return res.apiResponse({
          Rstatus: 2
        });
      } else if (result) {
        return res.apiResponse({
          Rstatus: 1
        });
      } else {
        return res.apiResponse({
          Rstatus: 0
        });
      }
    });

};

exports.getRequest = function(req, res) {

  Request.model.findById(req.body.requestId).exec(function (err, result) {
    if (err || !result) return res.apiError({
      message: 'Невозможно получить данные'
    });

    return res.apiResponse({
      count: result.guest.count,
      from: result.guest.from,
      to: result.guest.to,
      date: result.guest.date,
      time: result.guest.time,
      comment: result.guest.comment,
    });
  });

};

exports.driverOnRequest = function(req, res) {
  if (!req.user) {
		return res.apiError({
      message: 'Неавторизованный пользователь'
    });
	} else if (req.user && !req.user.isActive) {
		return res.apiError({
      message: 'Неавторизованный пользователь'
    });
	}

  async.series([

    function(cb) {
      const PriceModel = keystone.list('Price').model;
      const	newPrice = new PriceModel({
        value: req.body.requestPrice,
        submitedBy: req.user,
        assignedRequest: req.body.requestId
      });

      newPrice.save(function(err) {
        if (err) return res.apiError({
          message: 'Невозможно добавить цену'
        });
        return cb();
      });

    },

    function(cb) {
      Request.model.findById(req.body.requestId).exec(function (err, resultRequest) {
        Price.model.findOne()
          .where('submitedBy', req.user)
          .where('assignedRequest', resultRequest._id)
          .exec(function (err, resultPrice) {

            const assignedData = {
              'assignedBy': [...resultRequest.assignedBy, req.user._id],
              'assignedPrices': [...resultRequest.assignedPrices, resultPrice._id]
            };

            resultRequest.getUpdateHandler(req).process(assignedData, {
              fields: 'assignedBy, assignedPrices,',
              flashErrors: true
            }, function(err) {
              if (err) return res.apiError({
                message: 'Не удалось обновить заявку'
              });
              return cb();
            });
        });
      });
    },

    function (cb) {
      Request.model.findById(req.body.requestId).exec(function(err, result) {
        const driverForEmail = {
          specialPhoto: req.user._.specialPhoto.src(),
          driverPhoto: req.user._.driverPhoto.thumbnail(175, 175),
          name: req.user.name,
          car: req.user.car,
          id: req.user._id,
          from: result.guest.from,
          to: result.guest.to,
          nominalValue: req.user.rating.nominalValue
        };
          new keystone.Email({
            templateName: 'guest-notify',
            transport: 'mailgun',
          }).send({
            to: result.guest,
            from: mailFrom,
            subject: `Трансфер ${result.guest.from} - ${result.guest.to}`,
            driverData: driverForEmail,
            host: req.headers.origin,
            price: req.body.requestPrice,
            requestId: req.body.requestId
          }, (e) => e && console.warn('not done', e));
          return cb();
      });
    }

  ], function(err){

    if (err) return res.apiError({
      message: 'Что-то пошло не так... попробуйте еще раз'
    });

    return res.apiResponse(true);

  });

};
