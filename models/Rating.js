var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Rating Model
 * ==================
 */

var Rating = new keystone.List('Rating', {
	map: {name: 'hashId'}
});

Rating.add({
	hashId: { type: String, index: true, default: Math.random().toString(36).slice(-8), noedit: true },
	values: {
		trip: { type: Number },
		driver: { type: Number },
		car: { type: Number }
	},
	comment: { type: String, noedit: true },
	open: { type: Types.Datetime },
	closed: { type: Types.Datetime },
	assignedRequest: { type: Types.Relationship, ref: 'Request', index: true }
});

// Rating.relationship({ ref: 'Request', path: 'assigned', refPath: 'assignedRating' });

Rating.defaultColumns = 'hashId, assignedRequest';
Rating.register();