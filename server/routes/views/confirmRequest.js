var keystone = require('keystone'),
		moment = require('moment');

exports = module.exports = async function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	const RequestModel = keystone.list('Request').model;
	// Set locals
	locals.section = 'confirmRequest';
	locals.filters = {
		requestId: req.params.id
	};
	locals.stateOfRequest = 'success';

	function callback (err) {
		if (err) {
			console.error('There was an error sending the notification email:', err);
		}
	};

	function sentMail(resultRequest, price) {
		const address = resultRequest.guest;

		new keystone.Email({
			templateName: 'confirm-request-notify',
			transport: 'mailgun',
		}).send({
			to: address,
			from: {
				name: 'DRIVE SUKA DRIVE',
				email: 'postmaster@sandboxdae723c3f3084598b74d3512385ba33b.mailgun.org',
			},
			subject: `Трансфер ${resultRequest.guest.from} - ${resultRequest.guest.to} подтвержден`,
			data: resultRequest,
			moment,
			price
		}, callback);
	};

	view.on('init', function(next) {
		RequestModel.findById(locals.filters.requestId)
			.populate('submitedOn')
			.populate('submitedPrice')
			.exec(function (err, result) {
				if (!result.wasConfirmed) {
					if (err) {
						locals.stateOfRequest = 'failed';
						next(err);
					}

					locals.stateOfRequest = 'success';

					const confirmedData = {
						'wasConfirmed': true,
						'wasConfirmedTime': Date.now()
					};

					result.getUpdateHandler(req).process(confirmedData, {
						fields: 'wasConfirmed, wasConfirmedTime,',
						flashErrors: true
					}, async function(err) {
						sentMail(result, result.submitedPrice.value);
					});
				} else if (result.wasConfirmed) {
					locals.stateOfRequest = 'invalid';
				} else {
					locals.stateOfRequest = 'failed';
				}
			})
			.then(() => next());
	});

	view.render('confirmRequest');
};
