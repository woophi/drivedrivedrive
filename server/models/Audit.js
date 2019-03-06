var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Audit Model
 * ==================
 */

var Audit = new keystone.List('Audit', {
	map: {name: 'ip'}
});

Audit.add({
	ip: { type: String, noedit: true, label: 'IP адрес' },
	country: { type: String, noedit: true, label: 'Страна' },
	city: { type: String, noedit: true, label: 'Город' },
	language: { type: String, noedit: true, label: 'Язык' },
	auditRequest: { type: Types.Relationship, ref: 'Request', index: true, label: 'Привязанная заявка' }
});

Audit.defaultColumns = 'ip, country, auditRequest';
Audit.register();
