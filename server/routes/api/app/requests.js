var keystone = require('keystone'),
	_ = require('lodash'),
	User = keystone.list('User'),
	ObjectID = require('mongodb').ObjectID,
  Request = keystone.list('Request');


exports.getOpenRequests = function(req, res) {
	Request.model
		.find()
		.where('accepted', undefined)
		.exec(function (err, results) {
			if (err)
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);
			if (_.isEmpty(results))
				return res.apiError({message: 'Открытых заявок нет' }, null, err, 404);
			const filterResults = results
				.filter(r => !r.assignedBy
					.find(i => _.isEqual(i, new ObjectID(req.body.userId)))
				);

			return res.apiResponse(filterResults);
		});
};
exports.getSubmitedRequests = function(req, res) {
	Request.model
		.find()
		.where('submitedOn', req.body.userId)
		.exec(function (err, results) {
			if (err)
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);
			if (_.isEmpty(results))
				return res.apiError({message: 'Активных заявок нет' }, null, err, 404);

			const filterResults = results
				.filter(r => Date.parse(r.guest.date) > Date.now());

			return res.apiResponse(filterResults);
		});
};
exports.getHistoryRequests = function(req, res) {
	Request.model
		.find()
		.where('submitedOn', req.body.userId)
		.exec(function (err, results) {
			if (err)
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);
			if (_.isEmpty(results))
				return res.apiError({message: 'Прошлых заявок нет' }, null, err, 404);

			const filterResults = results
				.filter(r => Date.parse(r.guest.date) < Date.now());

			return res.apiResponse(filterResults);
		});
};