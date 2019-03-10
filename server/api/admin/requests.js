const keystone = require('keystone');
const { apiError } = require('../../lib/helpers');
const moment = require('moment');

exports.getAll = (_, res) => {
	const RequestModel = keystone.list('Request').model;
	console.warn(RequestModel);
	if (!RequestModel) {
		return res.apiResponse([]);
	}
	keystone.list('Request').model
		.find()
		.exec((err, results) => {
			if (err)
				return apiError(res, {message: 'Невозможно получить данные' }, 500);

			const requests = results.map(r => ({
					from: r.guest.from,
					to: r.guest.to,
					date: moment(r.guest.date).format('YYYY-MM-DD'),
					time: r.guest.time,
					id: r._id
				}));
			return res.apiResponse(requests);
		});
};