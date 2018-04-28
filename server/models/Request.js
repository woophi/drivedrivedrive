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
	created: { type: Types.Datetime, noedit: true },
	accepted: { type: Types.Datetime, noedit: true },
	assignedBy: { type: Types.Relationship, ref: 'User', many: true, index: true },
	assignedPrices: { type: Types.Relationship, ref: 'Price', many: true, index: true },
	submitedOn: { type: Types.Relationship, ref: 'User', index: true, noedit: true },
	submitedPrice: { type: Types.Relationship, ref: 'Price', index: true, noedit: true },
	wasAssignedOn: { type: Types.Relationship, ref: 'User', many: true, index: true },
	wasConfirmed: { type: Boolean, default: false, noedit: true },
	wasConfirmedTime: { type: Types.Datetime, noedit: true },
	assignedRating: { type: Types.Relationship, ref: 'Rating', noedit: true },
	rated: { type: Boolean, default: false, noedit: true  }
});

Request.relationship({ ref: 'Price', path: 'prices', refPath: 'assignedRequest' });
Request.relationship({ ref: 'Rating', path: 'ratings', refPath: 'assignedRequest' });
/**
 * Registration
 */
Request.defaultColumns = 'guest.name, guest.email, guest.date';
Request.register();
