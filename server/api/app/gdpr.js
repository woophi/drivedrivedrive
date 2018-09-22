const keystone = require('keystone');
const GDPR = keystone.list('Gdpr');
const { apiError } = require('../../lib/helpers');

exports.getGuestGdpr = (req, res) => {

	GDPR.model.findOne()
		.where('keyName', 'gdpr_1')
    .exec((err, result) => {
			if (err) {
				return apiError(res, {message: 'Системная ошибка' }, 500);
			}
			if (!result) {
				return apiError(res, {message: 'Извините, согласие не найдено' }, 404);
			}

      return res.apiResponse({
				title: result.title,
				keyName: result.keyName,
				text: result.text.html
			});
    });
};
exports.getUserGdpr = (req, res) => {

	GDPR.model.findOne()
		.where('keyName', 'gdpr_2')
    .exec((err, result) => {
			if (err) {
				return apiError(res, {message: 'Системная ошибка' }, 500);
			}
			if (!result) {
				return apiError(res, {message: 'Извините, согласие не найдено' }, 404);
			}

      return res.apiResponse({
				title: result.title,
				keyName: result.keyName,
				text: result.text.html
			});
    });
};
exports.getCookieGdpr = (req, res) => {

	GDPR.model.findOne()
		.where('keyName', 'gdpr_3')
    .exec((err, result) => {
			if (err) {
				return apiError(res, {message: 'Системная ошибка' }, 500);
			}
			if (!result) {
				return apiError(res, {message: 'Извините, согласие не найдено' }, 404);
			}

      return res.apiResponse({
				title: result.title,
				keyName: result.keyName,
				text: result.text.html
			});
    });
};