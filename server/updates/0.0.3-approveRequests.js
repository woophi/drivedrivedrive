const keystone = require('keystone');
const async = require('async');
const moment = require('moment');

let updates = 0;
function updateRequest(request, done) {
	let admin;
	let savedAprovalId;
	const ApprovalModel = keystone.list('Approval').model;
	async.series([

		(cb) => {
			keystone.list('User').model
				.findOne()
				.where('email', 'shakirovtimour@gmail.com')
				.exec((err, user) => {
					if (err)
						return cb(err);
					console.log('i find admin');
					admin = user;
					return cb();
				});
    },

    (cb) => {
			const newApproval = new ApprovalModel({
				approvedBy: admin._id,
				approvedRequest: request._id,
				approvedTime: request.created
			});
			newApproval.save((err, result) => {
        if (err) {
					return cb(err);
				}
				console.log('i set approval');
				savedAprovalId = result._id;
        return cb();
      });
		},

		(cb) => {
			request
				.set({
					approved: savedAprovalId
				})
				.save((err) => {
					if (err) {
						return cb(err);
					}
					console.log('i update request');
					return cb();
				});
		}
  ], (err) => {

    if (err) {
			return done(err);
		}
		updates +=1;
		console.log('i finish new update, all updates equal', updates);
    return done();

  });
}

module.exports = function(done) {

	const request = keystone.list('Request').model;

	request
		.find()
		.$where(`!this.approved`)
		.exec((err, requests) => {
			if (err) {
				console.log('fq wrong query', err);
				return done();
			}
			const filterRequests = requests.filter(r => moment(r.created).isBefore(moment('2019-03-26')));
			console.log('going to update number of requests', filterRequests.length);
			if (filterRequests.length) {
				async.forEach(filterRequests, updateRequest, done);
			} else {
				return done();
			}

		});

}
