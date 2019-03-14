const keystone = require('keystone');
const Request = keystone.list('Request');
const { compareGuestTimeWithToday, apiError } = require('../../lib/helpers');
const moment = require('moment');

exports.getOpenRequests = (req, res) => {
	Request.model
		.find()
		.where('wasConfirmed', false)
		.where('guest.notify', true)
		.exec((err, results) => {
			if (err)
				return apiError(res, {message: 'Невозможно получить данные' }, 500);

			const filterResults = results
				.filter(r => !r.assignedBy
					.find(i => i.toString() === req.body.userId)
				)
				.filter(r => compareGuestTimeWithToday(r.guest.date, r.guest.time, 'ge'));
			const requests = filterResults.map(r => ({
					from: r.guest.from,
					to: r.guest.to,
					date: moment(r.guest.date).format('YYYY-MM-DD'),
					time: r.guest.time,
					id: r._id
				}));
			return res.apiResponse(requests);
		});
};
exports.getInProcessRequests = (req, res) => {
	Request.model
		.find()
		.where('wasConfirmed', false)
		.$where('this.assignedBy.length > 0')
		.exec((err, results) => {
			if (err)
				return apiError(res, {message: 'Невозможно получить данные' }, 500);

			const filterResults = results
				.filter(r => r.assignedBy
					.find(i => i.toString() === req.body.userId)
				)
				.filter(r => compareGuestTimeWithToday(r.guest.date, r.guest.time, 'ge'));

			const requests = filterResults.map(r => ({
					from: r.guest.from,
					to: r.guest.to,
					date: moment(r.guest.date).format('YYYY-MM-DD'),
					time: r.guest.time,
					id: r._id
				}));
			return res.apiResponse(requests);
		});
};
exports.getSubmitedRequests = (req, res) => {
	Request.model
		.find()
		.where('submitedOn', req.body.userId)
		.exec((err, results) => {
			if (err)
				return apiError(res, {message: 'Невозможно получить данные' }, 500);

			const filterResults = results
				.filter(r => compareGuestTimeWithToday(r.guest.date, r.guest.time, 'ge'));

			const requests = filterResults.map(r => {
				const date = moment(r.guest.date).format('YYYY-MM-DD');

				return ({
					from: r.guest.from,
					to: r.guest.to,
					date,
					time: r.guest.time,
					id: r._id
				});
			});

			return res.apiResponse(requests);
		});
};
exports.getHistoryRequests = (req, res) => {
	Request.model
		.find()
		.where('submitedOn', req.body.userId)
		.exec((err, results) => {
			if (err)
				return apiError(res, {message: 'Невозможно получить данные' }, 500);

			const filterResults = results
				.filter(r => compareGuestTimeWithToday(r.guest.date, r.guest.time, 'less'));

			const requests = filterResults.map(r => {
				const date = moment(r.guest.date).format('YYYY-MM-DD');

				return ({
					from: r.guest.from,
					to: r.guest.to,
					date,
					time: r.guest.time,
					id: r._id
				});
			});

			return res.apiResponse(requests);
		});
};