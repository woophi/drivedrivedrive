var keystone = require('keystone');
var Types = keystone.Field.Types;
const { sendEmail } = require('../lib/helpers');

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

const deps = {
	driver: { 'isActive': true },
};

User.add({
	name: { type: Types.Name, required: true, index: true, label: 'Имя Фамилия' },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true, label: 'E-mail' },
	password: { type: Types.Password, initial: true, required: true, label: 'Пароль' },
	phone: { type: String, initial: true, required: true, index: true, label: 'Телефон' },
	resetPasswordKey: { type: String, hidden: true },
	token: { type: String, hidden: true },
	confirmedGDPR: { type: Types.Relationship, ref: 'Gdpr', index: true, noedit: true, label: 'GDPR'},
	language: { type: Types.Select, options: 'ru, en', default: 'ru', label: 'Изпользуемый язык' }
}, 'Водитель и машина', {
	photoFront: { type: Types.CloudinaryImage, label: 'Фото спереди' },
	photoSide: { type: Types.CloudinaryImage, label: 'Фото сбоку' },
	photoInside: { type: Types.CloudinaryImage, label: 'Фото внутри' },
	driverPhoto: { type: Types.CloudinaryImage, label: 'Фото водителя' },
	car: {
		kind: { type: String, label: 'Марка' },
		year: { type: Number, label: 'Год' },
		model: { type: String, label: 'Модель' }
	},
	specialPhoto: { type: Types.CloudinaryImage, label: 'Фото машины для письма' }
}, 'Уведомления', {
	notifications: {
		email: { type: Boolean, default: true, label: 'E-mail' },
		sms: { type: Boolean, default: false, label: 'Sms' }
	}
}, 'Роль пользователя', {
	isAdmin: { type: Boolean, label: 'Администратор', index: true },
	isSuperAdmin: { type: Boolean, default: false, label: 'Супер админ' },
	isActive: { type: Boolean, default: false, label: 'Активный водитель' },
}, 'Рейтинг', {
	rating: {
		nominalValue: { type: Number, label: 'Видимый рейтинг', default: 5, noedit: true, dependsOn: deps.driver },
		realValue: { type: Number, label: 'Настощий рейтинг', default: 5, noedit: true, dependsOn: deps.driver },
		count: { type: Number, hidden: true, default: 1 },
		assignedRatings: { type: Types.Relationship, ref: 'Rating', many: true, index: true, noedit: true, dependsOn: deps.driver, label: 'Все рейтинги' },
	}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin || this.isSuperAdmin;
});


/**
 * Relationships
 */
User.relationship({ ref: 'Request', path: 'submited', refPath: 'submitedOn' });
User.relationship({ ref: 'Request', path: 'was assigned', refPath: 'wasAssignedOn' });
User.relationship({ ref: 'Price', path: 'prices', refPath: 'submitedBy' });

User.schema.methods.resetPassword = function(req, res, next) {
	var user = this;
	user.resetPasswordKey = keystone.utils.randomString([16,24]);
	user.save(function(err) {
		if (err) return next(err);

		sendEmail({
			templateName: 'forgotten-password',
			to: user.email,
			subject: 'Сброс пароля'
		},
		{
			user,
			link: '/reset-password/' + user.resetPasswordKey,
			driver: true
		});
		next();
	});
}

/**
 * Registration
 */
User.defaultColumns = 'name, email, isActive';
User.register();
