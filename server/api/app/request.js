var async = require('async'),
  keystone = require('keystone'),
  User = keystone.list('User'),
  Request = keystone.list('Request'),
  Price = keystone.list('Price'),
	Rating = keystone.list('Rating');
const { sendEmail } = require('../../lib/helpers');
const { apiError } = require('../../lib/errorHandle');
const { t } = require('../../resources');
const { Rstatus } = require('../../lib/staticVars');

exports.getRequestState = (req, res) => {
  if (!req.user) {
		return res.apiResponse({
      Rstatus: Rstatus.UNAUTHORIZED
    });
	} else if (
			req.user && !req.user.isActive &&
			(!req.user.isAdmin || !req.user.isSuperAdmin)
		) {
		return res.apiResponse({
      Rstatus: Rstatus.FORBIDDEN
    });
  }

  Request.model.findById(req.body.requestId)
    .exec((err, result) => {
      if (err || !result) {
        console.error(err);
        return res.apiResponse({
          Rstatus: Rstatus.INVALID
        });
			}

			if (!result.guest.notify) {
				return res.apiResponse({
          Rstatus: Rstatus.INVALID
        });
			}

      const findAssignedDriver = result.assignedBy
              .find(i => i.toString()  === req.body.userId);

      if (result.submitedOn && !result.wasConfirmed) {
        return res.apiResponse({
          Rstatus: Rstatus.CLOSED
        });
      } else if (findAssignedDriver) {
        return res.apiResponse({
          Rstatus: Rstatus.ASSIGNED
        });
      } else if (result.wasConfirmed) {
        return res.apiResponse({
          Rstatus: Rstatus.INVALID
        });
      } else {
        return res.apiResponse({
          Rstatus: Rstatus.OPEN
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
          Rstatus: Rstatus.INVALID
        });
      }
      if (result.submitedOn && !result.wasConfirmed) {
        return res.apiResponse({
          Rstatus: Rstatus.CLOSED
        });
      } else if (!result.accepted && result.assignedBy && result.assignedBy.length) {
        return res.apiResponse({
          Rstatus: Rstatus.PROCESS
        });
      } else {
        return res.apiResponse({
          Rstatus: Rstatus.INVALID
        });
      }
    });
};

exports.getRequest = (req, res) => {
  Request.model.findById(req.body.requestId).exec((err, result) => {
    if (err || !result) {
			return apiError(res, 500, err);
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
		return apiError(res, 401);
	} else if (req.user && !req.user.isActive) {
		return apiError(res, 403);
	}

  async.series([
		(cb) => {
      Request.model.findById(req.body.requestId).exec((err, result) => {
        if (err) {
					return apiError(res, 500, err);
				}

				if (!result.guest.notify) {
					return apiError(res, 401);
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
					return apiError(res, 400, err);
        }

        return cb();
      });

    },

    (cb) => {
      Request.model.findById(req.body.requestId).exec((err, resultRequest) => {
				if (err) return apiError(res, 500, err);
        Price.model.findOne()
          .where('submitedBy', req.user)
          .where('assignedRequest', resultRequest._id)
          .exec((err, resultPrice) => {
						if (err) return apiError(res, 500, err);

            const assignedData = {
              'assignedBy': [...resultRequest.assignedBy, req.user._id],
              'assignedPrices': [...resultRequest.assignedPrices, resultPrice._id]
            };

            resultRequest.getUpdateHandler(req).process(assignedData, {
              fields: 'assignedBy, assignedPrices,',
              flashErrors: true
            }, (err) => {
              if (err) {
								return apiError(res, 400, err);
              }
              return cb();
            });
        });
      });
    },

    (cb) => {
      Request.model.findById(req.body.requestId).populate('audit').exec((err, result) => {
        if (err) {
					return apiError(res, 500, err);
				}

				if (!result.guest.notify) {
					return apiError(res, 401);
				}
        const driverForEmail = {
          specialPhoto: req.user._.specialPhoto.src(),
          driverPhoto: req.user._.driverPhoto.thumbnail(175, 175),
          name: req.user.name,
          car: req.user.car,
          id: req.user._id,
          from: result.guest.from,
          to: result.guest.to,
					nominalValue: req.user.rating.nominalValue,
					guestName: result.guest.name
				};
				const emailKeys = {
					templateName: 'guest-notify',
					to: result.guest,
					subject: t('mails.subject.transfer', {from: result.guest.from, to: result.guest.to}, result.audit.language)
				};

				const params = {
					driverData: driverForEmail,
					price: req.body.requestPrice,
					requestId: req.body.requestId,
					uniqHash: result.guest.uniqHash,
					language: result.audit.language
				};

				sendEmail(emailKeys, params);
				return cb();
      });
    }

  ], (err) => {

    if (err) {
			return apiError(res, 500, err);
    }

    return res.apiResponse(true);

  });

};

const sentMailsAfterAccept = (price, requestId, res) => {
  User.model.find().where('isAdmin', true).exec((err, resultAdmins) => {
    if (err) {
			return apiError(res, 500, err);
    }
    Request.model.findById(requestId)
      .populate('submitedOn')
      .exec((err, resultRequest) => {
        if (err) {
          return apiError(res, 500, err);
        }

				const addresses = [resultRequest.submitedOn];

				sendEmail({
					templateName: 'accept-request-notify',
					to: addresses,
					subject: t('mails.subject.transfer', {from: resultRequest.guest.from, to: resultRequest.guest.to}, resultRequest.submitedOn.language)
				},
				{
					guestData: resultRequest,
					price,
					driver: true,
					language: resultRequest.submitedOn.language
				});

				resultAdmins.forEach(admin => {
					sendEmail({
						templateName: 'accept-request-notify-admin',
						to: admin,
						subject: t('mails.subject.transfer', {from: resultRequest.guest.from, to: resultRequest.guest.to}, admin.language)
					},
					{
						data: resultRequest,
						price,
						driver: true,
						language: admin.language
					});
				});

      });
  });
};

exports.acceptRequest = (req, res) => {

  Request.model.findById(req.body.requestId)
    .where('assignedBy', req.body.driverId)
    .exec((err, result) => {
      if (err) {
				return apiError(res, 500, err);
      }
      if (result && !result.accepted) {
        Price.model.findOne()
          .where('submitedBy', req.body.driverId)
          .where('assignedRequest', result._id)
          .exec((err, resultPrice) => {
            if (err) {
							return apiError(res, 500, err);
            }

            const filterAssignedDrivers = result.assignedBy
              .filter(i => i.toString() !== req.body.driverId);

            const submitedData = {
              'submitedOn': req.body.driverId,
              'submitedPrice': resultPrice._id,
              'assignedBy': [],
              'accepted': Date.now(),
              'wasAssignedOn': [...filterAssignedDrivers]
            };

            result.getUpdateHandler(req).process(submitedData, {
              fields: 'submitedOn, submitedPrice, assignedBy, ' +
              'accepted, wasAssignedOn,',
              flashErrors: true
            }, (err) => {
              if (err) {
								return apiError(res, 500, err);
              }
              sentMailsAfterAccept(resultPrice.value, req.body.requestId, res);
              return res.apiResponse(true);
            });

          });
      } else {
				return res.apiResponse({ Rstatus: Rstatus.INVALID })
			}
		});

};

exports.confirmRequest = (req, res) => {
  if (!req.user) {
		return res.apiResponse({
      Rstatus: Rstatus.UNAUTHORIZED
    });
	} else if (req.user && (!req.user.isAdmin || !req.user.isSuperAdmin)) {
		return res.apiResponse({
      Rstatus: Rstatus.FORBIDDEN
    });
  }
    Request.model.findById(req.body.requestId)
			.populate('submitedOn')
			.populate('submitedPrice')
			.populate('audit')
			.exec((err, result) => {
        if (err) {
					return apiError(res, 500, err);
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
							return apiError(res, 500, err);
            }

						sendEmail({
							templateName: 'confirm-request-notify',
							to: result.guest,
							subject: t('mails.subject.transferConfirmed', {from: result.guest.from, to:result.guest.to }, result.audit.language)
						},
						{
							data: result,
							price: result.submitedPrice.value,
							uniqHash: result.guest.uniqHash,
							language: result.audit.language
						});

            return res.apiResponse({
              Rstatus: Rstatus.CLOSED
            });
					});
				} else if (result && result.wasConfirmed) {
					return res.apiResponse({
            Rstatus: Rstatus.CONFIRMED
          });
				} else {
					return res.apiResponse({
            Rstatus: Rstatus.INVALID
          });
				}
			});

};

exports.getRequestToRate = (req, res) => {

  if (!req.body.query) {
    return res.apiResponse({
      Rstatus: Rstatus.FORBIDDEN
    });
  }

  Request.model.findById(req.body.requestId)
    .where('assignedRatingTime', req.body.query)
    .populate('assignedRating')
    .exec((err, result) => {
      if (err || !result) {
        console.error(err);
        return res.apiResponse({
          Rstatus: Rstatus.INVALID
        });
      }

      if (result.assignedRating && !result.assignedRating.closed) {
        return res.apiResponse({
          Rstatus: Rstatus.RATING
        });
      } else if (result.assignedRating && result.assignedRating.closed) {
        return res.apiResponse({
          Rstatus: Rstatus.RATED
        });
      } else {
        return res.apiResponse({
          Rstatus: Rstatus.INVALID
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
				return apiError(res, 404, err);
      }
      User.model
        .findById(result.submitedOn._id)
        .exec(async (err, userResult) => {
          if (err) {
						return apiError(res, 404, err);
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
							return apiError(res, 500, err);
            }

            return res.apiResponse(true);
					});
        });
      });
}

const sentMailAfterRate = (result) => {
  User.model
    .find()
    .where('isAdmin', true)
    .exec((err, admins) => {

			admins.forEach(admin => {
				sendEmail({
					templateName: 'rate-request-notify-admin',
					to: resultAdmin,
					subject: t('mails.subject.ratedReq', {from:result.guest.from, to: result.guest.to }, admin.language)
				},
				{
					data: result,
					driver: true,
					language: admin.language
				});
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
						return apiError(res, 404, err);
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
							return apiError(res, 500, err);
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
						return apiError(res, 404, err);
          }

          const updateData = {
            'rated': true
          };

          result.getUpdateHandler(req).process(updateData, {
            fields: 'rated,',
            flashErrors: true
          }, (err) => {
            if (err) {
							return apiError(res, 500, err);
            }
            sentMailAfterRate(result);
            return cb();
          });
        });
    }

  ], (err) => {

    if (err) {
			return apiError(res, 500, err);
    }

    rateDriver(req.body.requestId, req, res);

  });

};

