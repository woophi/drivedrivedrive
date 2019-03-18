const keystone = require('keystone');
const async = require('async');

function updateGDPR(gdpr, done) {
	let payload = {
		textRU: undefined
	};

	payload.textRU = gdpr.text;
	console.log('set', gdpr.keyName);
	console.log('set', 'text' in gdpr);

  gdpr
		.set(payload)
		.save((err) => {
			if (err)
				console.error('GDPR save error', err);
			console.log('set sucsess');
			done(err);
		});
}

module.exports = function(done) {

	const gdpr = keystone.list('Gdpr').model;

	gdpr
		.find()
		.exec((err, gdprs) => {

			async.forEach(gdprs, updateGDPR, done);

		});

}
