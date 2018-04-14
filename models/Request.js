var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Request Model
 * ==========
 */
var Request = new keystone.List('Request', {
	map: {name: 'guest.name'}
});

Request.add({
	guest: {
		name: { type: String, index: true },
		email: { type: Types.Email, index: true },
		count: { type: Number, },
		from: { type: String, },
		to: { type: String, },
		date: { type: Date, },
		time: { type: String, },
		comment: { type: String },
		phone: { type: String }
	},
	created: { type: Types.Datetime },
	accepted: { type: Types.Datetime },
	assignedBy: { type: Types.Relationship, ref: 'User', many: true, index: true },
	assignedPrices: { type: Types.Relationship, ref: 'Price', many: true, index: true },
	submitedOn: { type: Types.Relationship, ref: 'User', index: true },
	submitedPrice: { type: Types.Relationship, ref: 'Price', index: true },
	wasAssignedOn: { type: Types.Relationship, ref: 'User', many: true, index: true },
	wasConfirmed: { type: Boolean, default: false },
	wasConfirmedTime: { type: Types.Datetime }
});

Request.relationship({ ref: 'Price', path: 'prices', refPath: 'assignedRequest' });
/**
 * Registration
 */
Request.defaultColumns = 'guest.name, guest.email, guest.date';
Request.register();
