const keystone = require('keystone');
const { apiError } = require('../../lib/helpers');

exports.getRequest = (req, res) => {
	keystone.list('Request').model
	.findById(req.body.requestId)
	.exec((err, request) => {
		if (err)
			return apiError(res, {message: 'Невозможно получить данные' }, 500);
		if (!request)
			return apiError(res, {message: 'Заявка не найдена' }, 404);

		return res.apiResponse(request);
	});
}