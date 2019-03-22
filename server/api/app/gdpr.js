const keystone = require('keystone');
const GDPR = keystone.list('Gdpr');
const { apiError } = require('../../lib/errorHandle');

exports.getGdprData = (req, res) => {

	GDPR.model.findOne()
		.where('keyName', req.body.keyName)
    .exec((err, result) => {
			if (err) {
				return apiError(res, 500, err);
			}
			if (!result) {
				return apiError(res, 404);
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