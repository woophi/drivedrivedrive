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
	value: { type: Number, index: true, label: 'Цена'  },
	submitedBy: { type: Types.Relationship, ref: 'User', label: 'Назначена водиетелем' },
	assignedRequest: { type: Types.Relationship, ref: 'Request', index: true, label: 'Выбранная заявка' }
});

Price.relationship({ ref: 'Request', path: 'submited', refPath: 'submitedPrice' });

Price.defaultColumns = 'value, submitedBy, assignedRequest';
Price.register();
