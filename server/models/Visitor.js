var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Uniq visitor Model
 * ==================
 */

var Visitor = new keystone.List('Visitor', {
	map: {name: 'value'}
});

Visitor.add({
	value: { type: String, index: true, label: 'Cookie', noedit: true  },
});

Visitor.defaultColumns = 'value';
Visitor.register();
