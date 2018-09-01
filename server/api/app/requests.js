const keystone = require('keystone');
const { isEmpty, isEqual } = require('lodash');
const User = keystone.list('User');
const Request = keystone.list('Request');
const moment = require('moment');

exports.getOpenRequests = (req, res) => {
	Request.model
		.find()
		.where('accepted', undefined)
		.where('wasConfirmed', false)
		.exec((err, results) => {
			if (err)
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);

			const filterResults = results
				.filter(r => !r.assignedBy
					.find(i => i.toString() === req.body.userId)
				);
			const mapResults = filterResults.map(r => {
				const date = moment(r.guest.date).format('YYYY-MM-DD');

				return ({
					from: r.guest.from,
					to: r.guest.to,
					date,
					time: r.guest.time,
					id: r._id
				});
			});
			const requests = mapResults.filter(r => {
				const parsedDateTime = moment(`${r.date} ${r.time}`, 'YYYYMMDD, HH:mm').format('YYYY-MM-DD, HH:mm');
				const today = moment().format('YYYY-MM-DD, HH:mm');

				if (parsedDateTime >= today) {
					return r;
				}

			});
			return res.apiResponse(requests);
		});
};
exports.getSubmitedRequests = (req, res) => {
	Request.model
		.find()
		.where('submitedOn', req.body.userId)
		.exec((err, results) => {
			if (err)
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);
			if (isEmpty(results))
				return res.apiError({message: 'Активных заявок нет' }, null, '', 404);

			const filterResults = results
				.filter(r => Date.parse(r.guest.date) > Date.now());

			return res.apiResponse(filterResults);
		});
};
exports.getHistoryRequests = (req, res) => {
	Request.model
		.find()
		.where('submitedOn', req.body.userId)
		.exec((err, results) => {
			if (err)
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);
			if (isEmpty(results))
				return res.apiError({message: 'Прошлых заявок нет' }, null, '', 404);

			const filterResults = results
				.filter(r => Date.parse(r.guest.date) < Date.now());

			return res.apiResponse(filterResults);
		});
};