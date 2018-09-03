var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Rating Model
 * ==================
 */

var Rating = new keystone.List('Rating', {
	map: {name: 'hashId'}
});

Rating.add({
	hashId: { type: String, index: true, default: Math.random().toString(36).slice(-8), noedit: true },
	values: {
		trip: { type: Number, label: 'Поездка' },
		driver: { type: Number, label: 'Водитель' },
		car: { type: Number, label: 'Машина' }
	},
	comment: { type: String, noedit: true, label: 'Комментарий' },
	open: { type: Types.Datetime, label: 'Рейтинг отправлен', noedit: true, },
	closed: { type: Types.Datetime, label: 'Рейтинг назначен', noedit: true, },
	assignedRequest: { type: Types.Relationship, ref: 'Request', index: true, label: 'Оцененная заявка' }
});

Rating.defaultColumns = 'hashId, assignedRequest';
Rating.register();