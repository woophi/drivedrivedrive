var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Gdpr Model
 * ==================
 */

var Gdpr = new keystone.List('Gdpr', {
	map: {name: 'title'}
});

Gdpr.add({
	title: { type: String, index: true, label: 'Заголовок' },
	text: { type: Types.Markdown, index: true, label: 'Содержание' }
});

Gdpr.relationship({ ref: 'Request', path: 'submited', refPath: 'confirmedGDPR' });

Gdpr.defaultColumns = 'title';
Gdpr.register();
