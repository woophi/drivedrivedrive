var keystone = require('keystone');
var Types = keystone.Field.Types;
var async = require('async');

/**
 * Gdpr Model
 * ==================
 */

var Gdpr = new keystone.List('Gdpr', {
	map: {name: 'title'}
});

const deps = {
	en: { 'language': 'en' },
	ru: { 'language': 'ru' }
};

Gdpr.add({
	title: { type: Types.Text, index: true, label: 'Заголовок' },
	text: { type: Types.Markdown, hidden: true },
	textRU: { type: Types.Markdown, label: 'Содержание', dependsOn: deps.ru },
	textEN: { type: Types.Markdown, label: 'Содержание', dependsOn: deps.en },
	keyName: { type: Types.Key, label: 'Ключ', noedit: true },
	language: { type: Types.Select, options: 'ru, en', default: 'ru' }
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
				gdpr.keyName = `gdpr_${count + 1}`;
				return done();
			});
		}
	], next);
});

Gdpr.relationship({ ref: 'Request', path: 'submited', refPath: 'confirmedGDPR' });

Gdpr.defaultColumns = 'keyName, title';
Gdpr.register();
