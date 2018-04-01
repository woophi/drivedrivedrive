var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Price Model
 * ==================
 */

var Price = new keystone.List('Price');

Price.add({
	value: { type: Number },
	submitedBy: { type: Types.Relationship, ref: 'User' },
	assignedRequest: { type: Types.Relationship, ref: 'Request', index: true }
});

Price.relationship({ ref: 'Request', path: 'requests', refPath: 'assignedPrices' });
Price.relationship({ ref: 'Request', path: 'requests', refPath: 'submitedPrice' });

Price.defaultColumns = 'value';
Price.register();
