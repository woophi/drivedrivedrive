var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Price Model
 * ==================
 */

var Price = new keystone.List('Price', {
	map: {name: 'value'}
});

Price.add({
	value: { type: Number, index: true  },
	submitedBy: { type: Types.Relationship, ref: 'User' },
	assignedRequest: { type: Types.Relationship, ref: 'Request', index: true }
});

Price.relationship({ ref: 'Request', path: 'assigned', refPath: 'assignedPrices' });
Price.relationship({ ref: 'Request', path: 'submited', refPath: 'submitedPrice' });

Price.defaultColumns = 'value, submitedBy, assignedRequest';
Price.register();
