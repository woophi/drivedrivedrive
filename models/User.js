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
	phone: { type: String, initial: true, required: true, index: true}
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
// TODO: relation with guests requests


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
