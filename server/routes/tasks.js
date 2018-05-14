const keystone = require('keystone');
const moment = require('moment');
const async = require('async');
const mailFrom = require('./api/staticVars').mailFrom;

const RequestModel = keystone.list('Request').model;
const RatingModel = keystone.list('Rating').model;
const host =  keystone.get('locals').host;

const getConfirmedRequests = () =>
	RequestModel
		.find()
		.where('rated', false)
		.where('wasConfirmed', true)
		.populate('submitedOn')
		.populate('submitedPrice')
		.exec(function (err, results) {
			if (err) {
				return err;
			}
			return results;
		});

exports.sendEmailToPastRequests = async () => {
	await getConfirmedRequests()
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

exports.notifyBeforeTransfer = async () => {
	await getConfirmedRequests()
		.then(requests => {
			if (requests.length) {
				requests.forEach(async request => {
					const parsedDate = moment(request.guest.date).format('YYYYMMDD');
					const today = moment().format('YYYYMMDD');
					const NEXT_DAY = -1;

					if ((today - parsedDate) === NEXT_DAY && !request.notified) {
						try {
							await async.series([

								function(cb) {

									const submitedData = {
										'notified': Date.now()
									};

									request
										.set(submitedData)
										.save(function(err) {
											if (err) return cb(err);
											console.log('notified assigned');
											return cb();
										});
								},

								function(cb) {
									new keystone.Email({
										templateName: 'feature-request-notify-guest',
										transport: 'mailgun',
									}).send({
										to: request.guest.email,
										from: mailFrom,
										subject: `Важное`,
										request,
										moment
									}, err => err && console.error(err));
									return cb();
								},

								function(cb) {
									new keystone.Email({
										templateName: 'feature-request-notify-driver',
										transport: 'mailgun',
									}).send({
										to: request.submitedOn.email,
										from: mailFrom,
										subject: `Важное`,
										request,
										moment
									}, err => err && console.error(err));
									return cb();
								},
							])
						} catch (error) {
							console.error(error);
							throw error;
						}
					}
				})
			}
		})
}