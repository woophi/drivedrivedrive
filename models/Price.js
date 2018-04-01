var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Price Model
 * ==================
 */

var Price = new keystone.List('Price');

Price.add({
	value: { type: Number },
	submitedBy: { type: Types.Relationship, ref: 'User' }
});

Price.relationship({ ref: 'Request', path: 'requests', refPath: 'assignedPrices' });

Price.defaultColumns = 'value';
Price.register();
