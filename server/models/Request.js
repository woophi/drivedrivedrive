var keystone = require('keystone');
var Types = keystone.Field.Types;
/**
 * Request Model
 * ==========
 */
var Request = new keystone.List('Request', {
	map: {name: 'guest.name'}
});

Request.add({
	guest: {
		name: { type: String, index: true, label: 'Имя' },
		email: { type: Types.Email, index: true, label: 'E-mail' },
		count: { type: Number, label: 'Количество человек' },
		from: { type: String, label: 'Из' },
		to: { type: String, label: 'В' },
		date: { type: Types.Date, label: 'Дата' },
		time: { type: String, label: 'Время' },
		comment: { type: String, label: 'Комментарий' },
		phone: { type: String, label: 'Телефон' },
		notify: { type: Boolean, default: true, noedit: true, label: 'Подписка на рассылку сообщений' },
		uniqHash: { type: String, noedit: true, hidden: true }
	},
	created: { type: Types.Datetime, noedit: true, label: 'Заявка создана' },
	accepted: { type: Types.Datetime, noedit: true, label: 'Водитель выбран' },
	assignedBy: { type: Types.Relationship, ref: 'User', many: true, index: true, label: 'Откликнулись' },
	assignedPrices: { type: Types.Relationship, ref: 'Price', many: true, index: true, label: 'Назначенные цены' },
	submitedOn: { type: Types.Relationship, ref: 'User', index: true, noedit: true, label: 'Выбранный водитель' },
	submitedPrice: { type: Types.Relationship, ref: 'Price', index: true, noedit: true, label: 'Выбранная цена' },
	wasAssignedOn: { type: Types.Relationship, ref: 'User', many: true, index: true, label: 'Откликнувшиеся' },
	wasConfirmed: { type: Boolean, default: false, noedit: true, label: 'Заявка подтверждена' },
	wasConfirmedTime: { type: Types.Datetime, noedit: true, label: 'Время подтверждения' },
  assignedRating: { type: Types.Relationship, ref: 'Rating', noedit: true, label: 'Назначенный рейтинг' },
  assignedRatingTime: { type: Number, noedit: true, hidden: true },
	rated: { type: Boolean, default: false, noedit: true, label: 'Заявка оценена' },
	notified: { type: Date, noedit: true, label: 'Отправлено уведомление' },
	confirmedGDPR: { type: Types.Relationship, ref: 'Gdpr', index: true, noedit: true, label: 'GDPR'},
	ip: { type: String, noedit: true, hidden: true },
	approved: { type: Types.Relationship, ref: 'Approval', index: true, noedit: true, label: 'Одобрено' }
});

Request.relationship({ ref: 'Price', path: 'prices', refPath: 'assignedRequest' });
Request.relationship({ ref: 'Rating', path: 'ratings', refPath: 'assignedRequest' });
/**
 * Registration
 */
Request.defaultColumns = 'guest.name, guest.email, guest.date';
Request.register();
