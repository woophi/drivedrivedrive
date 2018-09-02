const keystone = require('keystone');
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
exports.getInProcessRequests = (req, res) => {
	Request.model
		.find()
		.where('accepted', undefined)
		.where('wasConfirmed', false)
		.$where('this.assignedBy.length > 0')
		.exec((err, results) => {
			if (err)
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);

			const filterResults = results
				.filter(r => r.assignedBy
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

			const filterResults = results
				.filter(r => Date.parse(r.guest.date) > Date.now());

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
				return res.apiError({message: 'Невозможно получить данные' }, null, err, 500);

			const filterResults = results
				.filter(r => Date.parse(r.guest.date) < Date.now());

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