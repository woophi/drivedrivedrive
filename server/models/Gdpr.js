var keystone = require('keystone');
var Types = keystone.Field.Types;
var async = require('async');

/**
 * Gdpr Model
 * ==================
 */

var Gdpr = new keystone.List('Gdpr', {
	map: {name: 'keyName'}
});

Gdpr.add({
	keyName: { type: String, index: true, label: 'Ключ', noedit: true },
	title: { type: String, index: true, label: 'Заголовок' },
	text: { type: Types.Markdown, index: true, label: 'Содержание' }
});

Gdpr.schema.pre('save', function(next) {
	const gdpr = this;
	async.parallel([
		function(done) {
			if (gdpr.keyName) return done();
			keystone.list('Gdpr').model.count().exec(function(err, count) {
				if (err) {
					console.error('===== Error counting gdprs =====');
					console.error(err);
					return done();
				}
				gdpr.keyName = `gdpr_${count}`;
				return done();
			});
		}
	], next);
});

Gdpr.relationship({ ref: 'Request', path: 'submited', refPath: 'confirmedGDPR' });

Gdpr.defaultColumns = 'keyName, title';
Gdpr.register();
