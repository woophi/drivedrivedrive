var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	phone: { type: String, initial: true, required: true, index: true},
	resetPasswordKey: { type: String, hidden: true }
}, 'Profile', {
	photoFront: { type: Types.CloudinaryImage },
	photoSide: { type: Types.CloudinaryImage },
	photoInside: { type: Types.CloudinaryImage },
	driverPhoto: { type: Types.CloudinaryImage },
	car: {
		kind: { type: String },
		year: { type: Number },
		model: { type: String }
	}
}, 'Notifications', {
	notifications: {
		email: { type: Boolean, default: true },
		sms: { type: Boolean, default: false }
	}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	isActive: { type: Boolean, default: false, label: 'VODYATEL is active???' },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Relationships
 */
User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
User.relationship({ ref: 'Request', path: 'requests', refPath: 'assignedBy' });
User.relationship({ ref: 'Price', path: 'prices', refPath: 'submitedBy' });
User.relationship({ ref: 'Request', path: 'requests', refPath: 'submitedOn' });
// TODO: relation with guests requests

User.schema.methods.resetPassword = function(req, res, next) {
	var user = this;
	user.resetPasswordKey = keystone.utils.randomString([16,24]);
	user.save(function(err) {
		if (err) return next(err);
		new keystone.Email({
			templateName: 'forgotten-password',
			transport: 'mailgun',
		}).send({
			to: user.email,
			from: {
				name: 'DRIVE SUKA DRIVE',
				email: 'postmaster@sandboxdae723c3f3084598b74d3512385ba33b.mailgun.org',
			},
			subject: 'Сброс пароля',
			user: user,
			link: '/reset-password/' + user.resetPasswordKey,
			host: req.headers.origin
		}, next);
	});
}

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
