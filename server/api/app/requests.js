const keystone = require('keystone');
const { isEmpty, isEqual } = require('lodash');
const User = keystone.list('User');
const { ObjectID } = require('mongodb');
const Request = keystone.list('Request');


exports.getOpenRequests = (req, res) => {
	Request.model
		.find()
		.where('accepted', undefined)
		.exec((err, results) => {
			if (err)
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);
			if (isEmpty(results))
				return res.apiError({message: 'Открытых заявок нет' }, null, '', 404);
			const filterResults = results
				.filter(r => !r.assignedBy
					.find(i => isEqual(i, new ObjectID(req.body.userId)))
				);

			const data = filterResults.map(r => ({
				from: r.guest.from,
				to: r.guest.to,
				date: r.guest.date,
				time: r.guest.time,
				id: r._id
			}))
			return res.apiResponse(data);
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