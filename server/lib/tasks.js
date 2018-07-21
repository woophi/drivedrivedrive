const keystone = require('keystone');
const moment = require('moment');
const async = require('async');
const RequestModel = keystone.list('Request').model;
const RatingModel = keystone.list('Rating').model;
const host =  keystone.get('locals').host;
const { sendEmail } = require('./helpers');

const getConfirmedRequests = () =>
	RequestModel
		.find()
		.where('rated', false)
		.where('wasConfirmed', true)
		.populate('submitedOn')
		.populate('submitedPrice')
		.exec((err, results) => {
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

								(cb) => {
									const	newRating = new RatingModel({
										assignedRequest: request._id,
										open: Date.now()
									});
									newRating
										.save((err, result) => {
											if (err) {
												return cb(err);
											}
											console.warn('create');
											return cb();
										});
								},

								(cb) => {
									RatingModel
										.findOne()
										.where('assignedRequest', request._id)
										.exec((err, resultRating) => {
											if (err) return cb(err);

											const submitedData = {
												'assignedRating': resultRating._id,
												'assignedRatingTime': new Date().getTime()
											};

											RequestModel
												.findById(request._id)
												.exec((err, result) => {
													if (err) {
														return cb(err);
													}
													result
														.set(submitedData)
														.save((err, updatedResult) => {
															if (err) return cb(err);
															console.log('updated');
															return cb();
														});
												});
										})
								},

								(cb) => {
									RequestModel
										.findById(request._id)
										.exec((err, result) => {
											if (err) {
												return cb(err);
											}
											if (!result.guest.notify) {
												console.log('Guest unsubscribe');
												return cb();
											}
											sendEmail({
												templateName: 'rating-request-notify-guest',
												to: result.guest.email,
												subject: `Оцените Вашу поездку`
											},
											{
												result,
												host
											});
											return cb();
										});
								}

							], (err) => {

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

								(cb) => {

									const submitedData = {
										'notified': Date.now()
									};

									request
										.set(submitedData)
										.save((err) => {
											if (err) return cb(err);
											console.log('notified assigned');
											return cb();
										});
								},

								(cb) => {
									sendEmail({
										templateName: 'feature-request-notify-guest',
										to: request.guest.email,
										subject: `Важное`
									},
									{
										request
									});
									return cb();
								},

								(cb) => {
									sendEmail({
										templateName: 'feature-request-notify-driver',
										to: request.submitedOn.email,
										subject: `Важное`
									},
									{
										request
									});
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