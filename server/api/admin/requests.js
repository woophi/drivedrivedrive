const keystone = require('keystone');
const moment = require('moment');
const { apiError } = require('../../lib/errorHandle');

exports.getAll = (req, res) => {
	keystone.list('Request').model
		.find()
		.exec((err, results) => {
			if (err)
				return apiError(res, 500, err);

			const requests = results.map(r => ({
					from: r.guest.from,
					to: r.guest.to,
					date: moment(r.guest.date).format('YYYY-MM-DD'),
					time: r.guest.time,
					id: r._id,
					approved: !!r.approved
				}));
			return res.apiResponse(requests);
		});
};