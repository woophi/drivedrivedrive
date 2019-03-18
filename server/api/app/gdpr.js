const keystone = require('keystone');
const GDPR = keystone.list('Gdpr');
const { apiError } = require('../../lib/helpers');

exports.getGdprData = (req, res) => {

	GDPR.model.findOne()
		.where('keyName', req.body.keyName)
    .exec((err, result) => {
			if (err) {
				return apiError(res, {message: 'Системная ошибка' }, 500);
			}
			if (!result) {
				return apiError(res, {message: 'Извините, согласие не найдено' }, 404);
			}

			const content = result[`text${req.body.lang.toUpperCase()}`];
			const text = content ? content.html : 'not found';

      return res.apiResponse({
				title: result.title,
				keyName: result.keyName,
				text
			});
    });
};