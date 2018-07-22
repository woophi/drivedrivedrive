var async = require('async'),
  keystone = require('keystone'),
		_ = require('lodash'),
  User = keystone.list('User'),
  Request = keystone.list('Request'),
  Price = keystone.list('Price'),
  ObjectID = require("mongodb").ObjectID,
	Rating = keystone.list('Rating');
const { sendEmail } = require('../../../lib/helpers');

exports.getRequestState = (req, res) => {
  if (!req.user) {
		return res.apiResponse({
      Rstatus: -1
    });
	} else if (
			req.user && !req.user.isActive &&
			(!req.user.isAdmin || !req.user.isSuperAdmin)
		) {
		return res.apiResponse({
      Rstatus: -2
    });
  }

  Request.model.findById(req.body.requestId)
    .exec((err, result) => {
      if (err || !result) {
        console.error(err);
        return res.apiResponse({
          Rstatus: 4
        });
			}

			if (!result.guest.notify) {
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

exports.getRequestToAcceptStatus = (req, res) => {
  Request.model.findById(req.body.requestId)
    .exec((err, result) => {
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

exports.getRequest = (req, res) => {
  Request.model.findById(req.body.requestId).exec((err, result) => {
    if (err || !result) {
			return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);
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

exports.driverOnRequest = (req, res) => {
  if (!req.user) {
		return res.apiError({
      message: 'Неавторизованный пользователь'
		});
		return res.apiError({message: 'Неавторизованный пользователь' }, '', null, 401);
	} else if (req.user && !req.user.isActive) {
		return res.apiError({message: 'Неавторизованный пользователь' }, '', null, 403);
	}

  async.series([
		(cb) => {
      Request.model.findById(req.body.requestId).exec((err, result) => {
        if (err) {
					return res.apiError({message: 'Ошибка сервера' }, '', err, 500);
				}

				if (!result.guest.notify) {
					return res.apiError({message: 'Невозможно отправить уведомление клиенту' }, '', null, 401);
				}
				return cb();
      });
    },

    (cb) => {
      const PriceModel = keystone.list('Price').model;
      const	newPrice = new PriceModel({
        value: req.body.requestPrice,
        submitedBy: req.user,
        assignedRequest: req.body.requestId
      });

      newPrice.save((err) => {
        if (err) {
					return res.apiError({message: 'Невозможно добавить цену' }, '', err, 400);
        }

        return cb();
      });

    },

    (cb) => {
      Request.model.findById(req.body.requestId).exec((err, resultRequest) => {
				if (err) return res.apiError({message: 'Ошибка сервера' }, '', err, 500);
        Price.model.findOne()
          .where('submitedBy', req.user)
          .where('assignedRequest', resultRequest._id)
          .exec((err, resultPrice) => {
						if (err) return res.apiError({message: 'Ошибка сервера' }, '', err, 500);

            const assignedData = {
              'assignedBy': [...resultRequest.assignedBy, req.user._id],
              'assignedPrices': [...resultRequest.assignedPrices, resultPrice._id]
            };

            resultRequest.getUpdateHandler(req).process(assignedData, {
              fields: 'assignedBy, assignedPrices,',
              flashErrors: true
            }, (err) => {
              if (err) {
								return res.apiError({message: 'Не удалось обновить заявку' }, '', err, 400);
              }
              return cb();
            });
        });
      });
    },

    (cb) => {
      Request.model.findById(req.body.requestId).exec((err, result) => {
        if (err) {
					return res.apiError({message: 'Ошибка сервера' }, '', err, 500);
				}

				if (!result.guest.notify) {
					return res.apiError({message: 'Невозможно отправить уведомление клиенту' }, '', null, 401);
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
				const emailKeys = {
					templateName: 'guest-notify',
					to: result.guest,
					subject: `Трансфер ${result.guest.from} - ${result.guest.to}`
				};

				const params = {
					driverData: driverForEmail,
					price: req.body.requestPrice,
					requestId: req.body.requestId,
					host: req.headers.origin,
					uniqHash: result.guest.uniqHash
				};

				sendEmail(emailKeys, params);
				return cb();
      });
    }

  ], (err) => {

    if (err) {
			return res.apiError({message: 'Что-то пошло не так... попробуйте еще раз' }, '', err, 500);
    }

    return res.apiResponse(true);

  });

};

const sentMailsAfterAccept = (price, requestId, host) => {
  User.model.find().where('isAdmin', true).exec((err, resultAdmins) => {
    if (err) {
      return res.apiError({message: 'Ошибка сервера' }, '', err, 500);
    }
    Request.model.findById(requestId)
      .populate('submitedOn')
      .exec((err, resultRequest) => {
        if (err) {
          return res.apiError({message: 'Ошибка сервера' }, '', err, 500);
        }

				const addresses = [resultRequest.submitedOn];

				sendEmail({
					templateName: 'accept-request-notify',
					to: addresses,
					subject: `Трансфер ${resultRequest.guest.from} - ${resultRequest.guest.to}`
				},
				{
					guestData: resultRequest,
					price,
					driver: true
				});

				sendEmail({
					templateName: 'accept-request-notify-admin',
					to: resultAdmins,
					subject: `Трансфер ${resultRequest.guest.from} - ${resultRequest.guest.to}`
				},
				{
					data: resultRequest,
					price,
          host,
					driver: true
				});
      });
  });
};

exports.acceptRequest = (req, res) => {

  Request.model.findById(req.body.requestId)
    .where('assignedBy', req.body.driverId)
    .exec((err, result) => {
      if (err) {
				return res.apiError({message: 'Невозможно получить данные' }, '', err, 500);
      }
      if (result && !result.accepted) {
        Price.model.findOne()
          .where('submitedBy', req.body.driverId)
          .where('assignedRequest', result._id)
          .exec((err, resultPrice) => {
            if (err) {
							return res.apiError({message: 'Невозможно найти цену' }, '', err, 500);
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
            }, (err) => {
              if (err) {
								return res.apiError({message: 'Невозможно выбрать водителя' }, '', err, 500);
              }
              sentMailsAfterAccept(resultPrice.value, req.body.requestId, req.headers.origin);
              return res.apiResponse(true);
            });

          });
      }
		});

};

exports.confirmRequest = (req, res) => {
  if (!req.user) {
		return res.apiResponse({
      Rstatus: -1
    });
	} else if (req.user && (!req.user.isAdmin || !req.user.isSuperAdmin)) {
		return res.apiResponse({
      Rstatus: -2
    });
  }
    Request.model.findById(req.body.requestId)
			.populate('submitedOn')
			.populate('submitedPrice')
			.exec((err, result) => {
        if (err) {
					return res.apiError({message: 'Невозможно получить данные' }, '', err, 500);
        }

				if (result && !result.wasConfirmed) {

					const confirmedData = {
						'wasConfirmed': true,
						'wasConfirmedTime': Date.now()
					};

					result.getUpdateHandler(req).process(confirmedData, {
						fields: 'wasConfirmed, wasConfirmedTime,',
						flashErrors: true
          }, (err) => {
            if (err) {
							return res.apiError({message: 'Невозможно обновить данные' }, '', err, 500);
            }

						sendEmail({
							templateName: 'confirm-request-notify',
							to: result.guest,
							subject: `Трансфер ${result.guest.from} - ${result.guest.to} подтвержден`
						},
						{
							data: result,
							price: result.submitedPrice.value,
							uniqHash: result.guest.uniqHash
						});

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

exports.getRequestToRate = (req, res) => {

  if (!req.body.query) {
    return res.apiResponse({
      Rstatus: -2
    });
  }

  Request.model.findById(req.body.requestId)
    .where('assignedRatingTime', req.body.query)
    .populate('assignedRating')
    .exec((err, result) => {
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

const calculateRating = (newRating, ratings) => {
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

const rateDriver = (requestId, req, res) => {
  Request.model
    .findById(requestId)
    .populate('assignedRating')
    .populate('submitedOn')
    .exec((err, result) => {
      if (err) {
				return res.apiError({message: 'Невозможно найти заявку' }, '', err, 404);
      }
      User.model
        .findById(result.submitedOn._id)
        .exec(async (err, userResult) => {
          if (err) {
						return res.apiError({message: 'Невозможно найти водителя' }, '', err, 404);
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
          }, (err) => {
            if (err) {
							return res.apiError({message: 'Невозможно оценить водителя' }, '', err, 500);
            }

            return res.apiResponse(true);
					});
        });
      });
}

const sentMailAfterRate = (result, host) => {
  User.model
    .findOne()
    .where('isAdmin', true)
    .exec((err, resultAdmin) => {

			sendEmail({
				templateName: 'rate-request-notify-admin',
				to: resultAdmin,
				subject: `Оценка трансфера ${result.guest.from} - ${result.guest.to}`
			},
			{
				data: result,
				host,
				driver: true
			});
    });
};

exports.rateRequest = (req, res) => {

  async.series([

    (cb) => {
      Rating.model
        .findOne()
        .where('assignedRequest', req.body.requestId)
        .exec((err, resultRating) => {
          if (err) {
						return res.apiError({message: 'Невозможно найти рейтинг' }, '', err, 404);
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
          }, (err) => {
            if (err) {
							return res.apiError({message: 'Невозможно обновить рейтинг' }, '', err, 500);
            }
            return cb();
          });
        });
    },

    (cb) => {
      Request.model
        .findById(req.body.requestId)
        .populate('assignedRating')
        .populate('submitedOn')
        .exec((err, result) => {
          if (err) {
						return res.apiError({message: 'Невозможно найти заявку' }, '', err, 404);
          }

          const updateData = {
            'rated': true
          };

          result.getUpdateHandler(req).process(updateData, {
            fields: 'rated,',
            flashErrors: true
          }, (err) => {
            if (err) {
							return res.apiError({message: 'Ошибка в рейтинге' }, '', err, 500);
            }
            sentMailAfterRate(result, req.headers.origin);
            return cb();
          });
        });
    }

  ], (err) => {

    if (err) {
			return res.apiError({message: 'Что-то пошло не так... попробуйте еще раз' }, '', err, 500);
    }

    rateDriver(req.body.requestId, req, res);

  });

};

