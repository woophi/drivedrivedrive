var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	const RequestModel = keystone.list('Request').model;
	const PriceModel = keystone.list('Price').model;
	const UserModel = keystone.list('User').model;
	// Set locals
	locals.section = 'acceptRequest';
	locals.filters = {
		requestId: req.params.id,
		driverId: req.params.driverId
	};
	locals.stateOfRequest = 'submiting';

	function callback (err) {
		if (err) {
			console.error('There was an error sending the notification email:', err);
		}
	};

	function sentMail (params) {
		UserModel.findOne().where('isAdmin', true).exec(function(err, resultUser) {
			RequestModel.findById(locals.filters.requestId)
				.populate('submitedOn')
				.exec(function (err, resultRequest) {
					console.warn('start sending mails');

					const addresses = [resultRequest.submitedOn, resultUser];

					new keystone.Email({
						templateName: 'accept-request-notify',
						transport: 'mailgun',
					}).send({
						to: addresses,
						from: {
							name: 'DRIVE SUKA DRIVE',
							email: 'postmaster@sandboxdae723c3f3084598b74d3512385ba33b.mailgun.org',
						},
						subject: `Трансфер ${resultRequest.guest.from} - ${resultRequest.guest.to}`,
						guestData: resultRequest
					}, callback);
				});
		});
	};

	view.on('init', function(next) {

		RequestModel.findById(locals.filters.requestId)
			.where('assignedBy', locals.filters.driverId)
			.exec(function (err, result) {
			if (result && !result.accepted) {
				PriceModel.findOne()
					.where('submitedBy', locals.filters.driverId)
					.where('assignedRequest', result._id)
					.exec(function (err, resultPrice) {

							const submitedData = {
								'submitedOn': locals.filters.driverId,
								'submitedPrice': resultPrice._id,
								'assignedBy': [],
								'accepted': Date.now()
							};

							result.getUpdateHandler(req).process(submitedData, {
								fields: 'submitedOn, submitedPrice, assignedBy, accepted,',
								flashErrors: true
							}, function(err) {
								locals.stateOfRequest = 'success';
								sentMail();
								return next(err);
							});

					});
			} else if (result && result.accepted) {
				locals.stateOfRequest = 'url is not valid';
				return next(err);
			} else {
				locals.stateOfRequest = 'failed';
				return next(err);
			}
		});

	});

	view.render('acceptRequest');
};
