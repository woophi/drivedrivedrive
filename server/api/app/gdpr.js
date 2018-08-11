const keystone = require('keystone');
const GDPR = keystone.list('Gdpr');

exports.getGuestGdpr = (req, res) => {

	GDPR.model.findOne()
		.where('keyName', 'gdpr_1')
    .exec((err, result) => {
      if (err) {
        console.error(err);
        return res.apiResponse({
          Rstatus: 4
        });
			}
			if (err) {
				return res.apiError({message: 'Системная ошибка' }, '', err, 500);
			}
			if (!result) {
				return res.apiError({message: 'Извините, согласие не найдено' }, '', null, 404);
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
        console.error(err);
        return res.apiResponse({
          Rstatus: 4
        });
			}
			if (err) {
				return res.apiError({message: 'Системная ошибка' }, '', err, 500);
			}
			if (!result) {
				return res.apiError({message: 'Извините, согласие не найдено' }, '', null, 404);
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
        console.error(err);
        return res.apiResponse({
          Rstatus: 4
        });
			}
			if (err) {
				return res.apiError({message: 'Системная ошибка' }, '', err, 500);
			}
			if (!result) {
				return res.apiError({message: 'Извините, согласие не найдено' }, '', null, 404);
			}

      return res.apiResponse({
				title: result.title,
				keyName: result.keyName,
				text: result.text.html
			});
    });
};