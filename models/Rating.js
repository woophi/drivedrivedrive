var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Rating Model
 * ==================
 */

var Rating = new keystone.List('Rating', {
	map: {name: 'value'}
});

Rating.add({
	value: { type: Number, index: true  },
	comment: { type: String, noedit: true },
	open: { type: Types.Datetime },
	closed: { type: Types.Datetime },
	assignedRequest: { type: Types.Relationship, ref: 'Request', index: true }
});

Rating.relationship({ ref: 'Request', path: 'assigned', refPath: 'assignedRating' });

Rating.defaultColumns = 'value, assignedRequest';
Rating.register();