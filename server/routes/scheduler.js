const keystone = require('keystone');
const schedule = require('node-schedule');
const moment = require('moment');
const async = require('async');
const mailFrom = require('./api/staticVars').mailFrom;

const RequestModel = keystone.list('Request').model;
const RatingModel = keystone.list('Rating').model;
const host =  keystone.get('locals').host;

exports.schedulerWorker = () => {
	const devPattern = '1 * * * * *';
	const prodPattern = '09 09 * * *';
	const getPatternTime = keystone.get('env') === 'production' || keystone.get('env') === 'staging' ?
		prodPattern : devPattern;
	schedule.scheduleJob(getPatternTime, async () => {
		console.log('The answer to life, the universe, and everything!');
		await sendEmailToPastRequests();
	});
}

// typeof result === Promise
const getNotRatedRequests = () =>
	RequestModel
		.find()
		.where('rated', false)
		.where('wasConfirmed', true)
		.exec(function (err, results) {
			if (err) {
				return err;
			}
			return results;
		});

const sendEmailToPastRequests = async () => {
	await getNotRatedRequests()
		.then((requests) => {
			if (requests.length) {
				requests.forEach(async request => {
					const parsedDate = moment(request.guest.date).add(1, 'd').format('YYYYMMDD');
					const today = moment().format('YYYYMMDD');
					if (parsedDate === today && !request.assignedRating) {
						console.warn('start');
						try {
              await async.series([

                function(cb) {
                  const	newRating = new RatingModel({
                    assignedRequest: request._id,
                    open: Date.now()
                  });
                  newRating
                    .save(async function(err, result) {
                      if (err) {
                        return cb(err);
                      }
                      console.warn('create');
                      return cb();
                    });
                },

                function(cb) {
                  RatingModel
                    .findOne()
                    .where('assignedRequest', request._id)
                    .exec(function (err, resultRating) {
                      if (err) return cb(err);

                      const submitedData = {
                        'assignedRating': resultRating._id,
                        'assignedRatingTime': new Date().getTime()
                      };

                      RequestModel
                        .findById(request._id)
                        .exec(function (err, result) {
                          if (err) {
                            return cb(err);
                          }
                          result
                            .set(submitedData)
                            .save(function(err, updatedResult) {
                              if (err) return cb(err);
                              console.log('updated');
                              return cb();
                            });
                        });
                    })
                },

                function(cb) {
                  RequestModel
                    .findById(request._id)
                    .exec(function (err, result) {
                      if (err) {
                        return cb(err);
                      }
                      new keystone.Email({
                        templateName: 'rating-request-notify-guest',
                        transport: 'mailgun',
                      }).send({
                        to: result.guest.email,
                        from: mailFrom,
                        subject: `Оцените Вашу поездку`,
                        result,
                        host
                      }, err => err && console.error(err));
                      return cb();
                    });
                }

              ], function(err){

                if (err) {
                  return err;
                }

                console.warn('rating sent');
                return true;

              });
						} catch (error) {
							console.error(error);
							throw error;
						}
					}
				});
			}
		})
};
