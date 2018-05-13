var async = require('async'),
  keystone = require('keystone'),
		_ = require('lodash'),
  User = keystone.list('User'),
  moment = require('moment'),
  mailFrom = require('../staticVars').mailFrom,
  Request = keystone.list('Request'),
  Price = keystone.list('Price'),
  ObjectID = require("mongodb").ObjectID,
  Rating = keystone.list('Rating');

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
    .exec(function (err, result) {
      if (err || !result) {
        console.error(err);
        return res.apiResponse({
          Rstatus: 4
        });
      }

      const findAssignedDriver = result.assignedBy
              .find(i => _.isEqual(i, new ObjectID(req.body.userId)));

      if (result.submitedOn && !result.wasConfirmed) {
        return res.apiResponse({
          Rstatus: 2
        });
      } else if (findAssignedDriver) {
        return res.apiResponse({
          Rstatus: 1
        });
      } else if (result.wasConfirmed) {
        return res.apiResponse({
          Rstatus: 4
        });
      } else {
        return res.apiResponse({
          Rstatus: 0
        });
      }
    });


};

exports.getRequestToAccept = function(req, res) {
  Request.model.findById(req.body.requestId)
    .exec(function (err, result) {
      if (err || !result) {
        console.error(err);
        return res.apiResponse({
          Rstatus: 4
        });
      }
      if (result.submitedOn && !result.wasConfirmed) {
        return res.apiResponse({
          Rstatus: 2
        });
      } else if (!result.accepted && result.assignedBy && result.assignedBy.length) {
        return res.apiResponse({
          Rstatus: 3
        });
      } else {
        return res.apiResponse({
          Rstatus: 4
        });
      }
    });
};

exports.getRequest = function(req, res) {

  Request.model.findById(req.body.requestId).exec(function (err, result) {
    if (err || !result) {
      console.error(err);
      return res.apiError({
        message: 'Невозможно получить данные'
      });
    }

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
        if (err) {
          console.error(err);
          return res.apiError({
            message: 'Невозможно добавить цену'
          });
        }

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
              if (err) {
                console.error(err);
                return res.apiError({
                  message: 'Не удалось обновить заявку'
                });
              }
              return cb();
            });
        });
      });
    },

    function (cb) {
      Request.model.findById(req.body.requestId).exec(function(err, result) {
        if (err) {
          console.error(err);
          return cb(err);
        }
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
          }, (e) => e && console.error('not done', e));
          return cb();
      });
    }

  ], function(err){

    if (err) {
      console.error(err);
      return res.apiError({
        message: 'Что-то пошло не так... попробуйте еще раз'
      });
    }

    return res.apiResponse(true);

  });

};

function sentMailAfterAccept(price, requestId, host) {
  User.model.find().where('isAdmin', true).exec(function(err, resultAdmins) {
    if (err) {
      console.error(err);
    }
    Request.model.findById(requestId)
      .populate('submitedOn')
      .exec(function (err, resultRequest) {
        if (err) {
          console.error(err);
        }

        const addresses = [resultRequest.submitedOn];

        new keystone.Email({
          templateName: 'accept-request-notify',
          transport: 'mailgun',
        }).send({
          to: addresses,
          from: mailFrom,
          subject: `Трансфер ${resultRequest.guest.from} - ${resultRequest.guest.to}`,
          guestData: resultRequest,
          moment,
          price
        }, (e) => e && console.error('not done', e));
        new keystone.Email({
          templateName: 'accept-request-notify-admin',
          transport: 'mailgun',
        }).send({
          to: resultAdmins,
          from: mailFrom,
          subject: `Трансфер ${resultRequest.guest.from} - ${resultRequest.guest.to}`,
          data: resultRequest,
          moment,
          price,
          host
        }, (e) => e && console.error('not done', e));
      });
  });
};

exports.acceptRequest = function(req, res) {

  Request.model.findById(req.body.requestId)
    .where('assignedBy', req.body.driverId)
    .exec(function (err, result) {
      if (err) {
        console.error(err);
        return res.apiError({
          message: 'Невозможно получить данные'
        });
      }
      if (result && !result.accepted) {
        Price.model.findOne()
          .where('submitedBy', req.body.driverId)
          .where('assignedRequest', result._id)
          .exec(function (err, resultPrice) {
            if (err) {
              console.error(err);
              return res.apiError({
                message: 'Невозможно найти цену'
              })
            }

            const filterAssignedDrivers = result.assignedBy
              .filter(i => !_.isEqual(i, new ObjectID(req.body.driverId)));

            const submitedData = {
              'submitedOn': req.body.driverId,
              'submitedPrice': resultPrice._id,
              'assignedBy': [],
              'accepted': Date.now(),
              'guest.phone': req.body.guestPhone,
              'wasAssignedOn': [...filterAssignedDrivers]
            };

            result.getUpdateHandler(req).process(submitedData, {
              fields: 'submitedOn, submitedPrice, assignedBy, ' +
              'accepted, guest.phone, wasAssignedOn,',
              flashErrors: true
            }, function(err) {
              if (err) {
                console.error(err);
                return res.apiError({
                  message: 'Невозможно выбрать водителя'
                });
              }
              sentMailAfterAccept(resultPrice.value, req.body.requestId, req.headers.origin);
              return res.apiResponse(true);
            });

          });
      }
});

};

exports.confirmRequest = function(req, res) {
  if (!req.user) {
		return res.apiResponse({
      Rstatus: -1
    });
	} else if (req.user && (!req.user.isAdmin || !req.user.isSuperAdmin)) {
		return res.apiResponse({
      Rstatus: -2
    });
  }

  function sentMail(resultRequest, price) {
		const address = resultRequest.guest;

		new keystone.Email({
			templateName: 'confirm-request-notify',
			transport: 'mailgun',
		}).send({
			to: address,
			from: mailFrom,
			subject: `Трансфер ${resultRequest.guest.from} - ${resultRequest.guest.to} подтвержден`,
			data: resultRequest,
			moment,
			price
		}, (e) => e && console.error('not done', e));
	};

    Request.model.findById(req.body.requestId)
			.populate('submitedOn')
			.populate('submitedPrice')
			.exec(function (err, result) {
        if (err) {
          console.error(err);
          return res.apiError({
            message: 'Невозможно получить данные'
          });
        }

				if (result && !result.wasConfirmed) {

					const confirmedData = {
						'wasConfirmed': true,
						'wasConfirmedTime': Date.now()
					};

					result.getUpdateHandler(req).process(confirmedData, {
						fields: 'wasConfirmed, wasConfirmedTime,',
						flashErrors: true
          }, function(err) {
            if (err) {
              console.error(err);
              return res.apiError({
                message: 'Невозможно обновить данные'
              });
            }
            sentMail(result, result.submitedPrice.value);
            return res.apiResponse({
              Rstatus: 2
            });
					});
				} else if (result && result.wasConfirmed) {
					return res.apiResponse({
            Rstatus: 5
          });
				} else {
					return res.apiResponse({
            Rstatus: 4
          });
				}
			});

};

exports.getRequestToRate = function(req, res) {

  if (!req.body.query) {
    return res.apiResponse({
      Rstatus: -2
    });
  }

  Request.model.findById(req.body.requestId)
    .where('assignedRatingTime', req.body.query)
    .populate('assignedRating')
    .exec(function (err, result) {
      if (err || !result) {
        console.error(err);
        return res.apiResponse({
          Rstatus: 4
        });
      }

      if (result.assignedRating && !result.assignedRating.closed) {
        return res.apiResponse({
          Rstatus: 7
        });
      } else if (result.assignedRating && result.assignedRating.closed) {
        return res.apiResponse({
          Rstatus: 6
        });
      } else {
        return res.apiResponse({
          Rstatus: 4
        });
      }
    });

};

function calculateRating (newRating, ratings) {
  var Ad = newRating.values.driver;
  var Ac = newRating.values.car;
  var At = newRating.values.trip;
  var SI = 2.5;
  Ad = Ad <= 1 && At <= 1 || Ad <= 1 && Ac <= 1 || Ac <= 1 && At <= 1 ?
    Ad + SI : Ad;
  var R = (Ad + Ac + At) / 3;
  var newCounter = ratings.count + 1;
  var oldRealValue = ratings.realValue;
  var Sum = oldRealValue * ratings.count;

  var realValue = (Sum + R) / newCounter;
  var nominalValue = newCounter > 3 ? realValue.toFixed(1) : ratings.nominalValue;

  return { realValue, nominalValue };
}

function rateDriver (requestId, req, res) {
  Request.model
    .findById(requestId)
    .populate('assignedRating')
    .populate('submitedOn')
    .exec(function(err, result) {
      if (err) {
        console.error(err);
        return res.apiError({
          message: 'Невозможно найти заявку'
        });
      }
      User.model
        .findById(result.submitedOn._id)
        .exec(async function(err, userResult) {
          if (err) {
            console.error(err);
            return res.apiError({
              message: 'Невозможно найти водителя'
            });
          }

          const assignedRatingsConc = userResult.rating.assignedRatings ?
            [...userResult.rating.assignedRatings, result.assignedRating._id ] :
            [ result.assignedRating._id ];

          const { realValue, nominalValue } = await calculateRating(result.assignedRating, userResult.rating);

          const newCount = userResult.rating.count + 1;

          const updateData = {
            'rating.nominalValue': nominalValue,
            'rating.realValue': realValue,
            'rating.count': newCount,
            'rating.assignedRatings': assignedRatingsConc
          };

          userResult.getUpdateHandler(req).process(updateData, {
            fields: 'rating.nominalValue, rating.realValue, rating.count, rating.assignedRatings,',
            flashErrors: true
          }, function(err) {
            if (err) {
              console.error(err);
              return res.apiError({
                message: 'Невозможно оценить водителя'
              });
            }

            return res.apiResponse(true);
					});
        });
      });
}

function sentMailAfterRate(result, host) {
  User.model
    .findOne()
    .where('isAdmin', true)
    .exec(function(err, resultAdmin) {
      new keystone.Email({
        templateName: 'rate-request-notify-admin',
        transport: 'mailgun',
      }).send({
        to: resultAdmin,
        from: mailFrom,
        subject: `Оценка трансфера ${result.guest.from} - ${result.guest.to}`,
        data: result,
        moment,
        host
      }, err => err && console.error(err));
    });
};

exports.rateRequest = function(req, res) {

  async.series([

    function(cb) {
      Rating.model
        .findOne()
        .where('assignedRequest', req.body.requestId)
        .exec(function (err, resultRating) {
          if (err) {
            console.error(err);
            return res.apiError({
              message: 'Невозможно найти рейтинг'
            });
          }

          const updateData = {
            'values.trip': req.body.ratingTrip,
            'values.driver': req.body.ratingDriver,
            'values.car': req.body.ratingCar,
            'comment': req.body.ratingComment,
            'closed': Date.now()
          };

          resultRating.getUpdateHandler(req).process(updateData, {
            fields: 'values.trip, values.driver, values.car, comment, closed,',
            flashErrors: true
          }, function(err) {
            if (err) {
              console.error(err);
              return res.apiError({
                message: 'Невозможно обновить рейтинг'
              });
            }
            return cb();
          });
        });
    },

    function (cb) {
      Request.model
        .findById(req.body.requestId)
        .populate('assignedRating')
        .populate('submitedOn')
        .exec(function(err, result) {
          if (err) {
            console.error(err);
            return res.apiError({
              message: 'Невозможно найти рейтинг'
            });
          }

          const updateData = {
            'rated': true
          };

          result.getUpdateHandler(req).process(updateData, {
            fields: 'rated,',
            flashErrors: true
          }, function(err) {
            if (err) {
              console.error(err);
              return res.apiError({
                message: 'Ошибка в рейтинге'
              });
            }
            sentMailAfterRate(result, req.headers.origin);
            return cb();
          });
        });
    }

  ], function(err){

    if (err) {
      console.error(err);
      return res.apiError({
        message: 'Что-то пошло не так... попробуйте еще раз'
      });
    }

    rateDriver(req.body.requestId, req, res);

  });

};

