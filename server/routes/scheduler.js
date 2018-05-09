const keystone = require('keystone');
const schedule = require('node-schedule');
const moment = require('moment');

const RequestModel = keystone.list('Request').model;
const RatingModel = keystone.list('Rating').model;
const host =  keystone.get('locals').host;

exports.schedulerWorker = () => {
	const devPattern = '1 * * * * *';
	const prodPattern = '23 23 * * *';
	const getPatternTime = keystone.get('env') === 'production' || keystone.get('env') === 'staging' ?
		prodPattern : devPattern;
	schedule.scheduleJob(getPatternTime, async () => {
		console.log('The answer to life, the universe, and everything!');
		// await sendEmailToPastRequests();
	});
}

// typeof result === Promise
const getNotRatedRequests = () =>
	RequestModel
		.find()
		.where('rated', false)
		.where('wasConfirmed', true)
		.exec(function (err, results) {
			if (err) {
				return err;
			}
			return results;
		});

const createAssignedRating = (requestId) => {
	const	newRating = new RatingModel({
		assignedRequest: requestId,
		open: Date.now()
	});
	return (
		newRating
			.save(async function(err, result) {
				if (err) {
					return err;
				}
				console.warn('create');
				await assignRatingToRequest(result._id, requestId)
				return result;
			})
	)
};

const assignRatingToRequest = (newRatingId, requestId) => {
	const submitedData = {
		'assignedRating': newRatingId
	};

	return RequestModel
		.findById(requestId)
		.exec(function (err, result) {
			if (err) {
				return err;
			}
			return result
				.set(submitedData)
				.save(function(err, updatedResult) {
					if (err) return err;
					console.log('updated');
					return updatedResult;
				});
		});

}

const sentMail = data => {
	console.warn('mail sent');
	return new keystone.Email({
		templateName: 'rating-request-notify-guest',
		transport: 'mailgun',
	}).send({
		to: data.guest.email,
		from: {
			name: 'DRIVE SUKA DRIVE',
			email: 'postmaster@sandboxdae723c3f3084598b74d3512385ba33b.mailgun.org',
		},
		subject: `Оцените Вашу поездку`,
		data,
		host
	}, err => err && console.error(err));
}

const sendEmailToPastRequests = async () => {
	await getNotRatedRequests()
		.then((requests) => {
			if (requests.length) {
				requests.forEach(async request => {
					const parsedDate = moment(request.guest.date).add(1, 'd').format('YYYYMMDD');
					const today = moment().format('YYYYMMDD');
					if (parsedDate === today && !request.assignedRating) {
						console.warn('start');
						try {
							await createAssignedRating(request._id);
							await sentMail(request);
						} catch (error) {
							console.error(error);
							throw error;
						}
					}
				});
			}
		})
};
