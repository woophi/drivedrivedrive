const keystone = require('keystone');
const { apiError } = require('../../lib/helpers');
const moment = require('moment');
const { t } = require('../../resources');

exports.getAll = (req, res) => {
	keystone.list('Request').model
		.find()
		.exec((err, results) => {
			if (err)
				return apiError(res, {message: t('errors.unableToGet', {}, req.user.language) }, 500);

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