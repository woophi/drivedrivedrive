var keystone = require('keystone');
var Types = keystone.Field.Types;
var async = require('async');

/**
 * Rating Model
 * ==================
 */

var Rating = new keystone.List('Rating', {
	map: {name: 'hashId'}
});

Rating.add({
	hashId: { type: String, index: true, noedit: true },
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

Rating.schema.pre('save', function(next) {
	const rating = this;
	async.parallel([
		function(done) {
			if (rating.hashId) return done();
			keystone.list('Rating').model.count().exec(function(err, count) {
				if (err) {
					console.error('===== Error set random hash =====');
					console.error(err);
					return done();
				}
				rating.hashId = keystone.utils.randomString([8,16]);;
				return done();
			});
		}
	], next);
});

Rating.defaultColumns = 'hashId, assignedRequest';
Rating.register();