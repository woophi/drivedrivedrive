var keystone = require('keystone');
var Types = keystone.Field.Types;
var mailFrom = require('../routes/api/staticVars').mailFrom;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

const deps = {
	driver: { 'isActive': true },
};

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
	},
	specialPhoto: { type: Types.CloudinaryImage }
}, 'Notifications', {
	notifications: {
		email: { type: Boolean, default: true },
		sms: { type: Boolean, default: false }
	}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Администратор', index: true },
	isSuperAdmin: { type: Boolean, default: false, label: 'Супер админ' },
	isActive: { type: Boolean, default: false, label: 'Активный водитель' },
}, 'Rating', {
	rating: {
		nominalValue: { type: Number, label: 'Видимый рейтинг', default: 5, noedit: true, dependsOn: deps.driver },
		realValue: { type: Number, label: 'Настощий рейтинг', default: 5, noedit: true, dependsOn: deps.driver },
		count: { type: Number, hidden: true, default: 1 },
		assignedRatings: { type: Types.Relationship, ref: 'Rating', many: true, index: true, noedit: true, dependsOn: deps.driver },
	}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin || this.isSuperAdmin;
});


/**
 * Relationships
 */
// User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
// User.relationship({ ref: 'Request', path: 'assigned', refPath: 'assignedBy' });
User.relationship({ ref: 'Request', path: 'submited', refPath: 'submitedOn' });
User.relationship({ ref: 'Request', path: 'was assigned', refPath: 'wasAssignedOn' });
User.relationship({ ref: 'Price', path: 'prices', refPath: 'submitedBy' });
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
			from: mailFrom,
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
User.defaultColumns = 'name, email, isActive';
User.register();
