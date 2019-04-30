var keystone = require('keystone');
var Types = keystone.Field.Types;
var async = require('async');
const { sendEmail } = require('../lib/helpers');
/**
 * Notification Model
 * notification center
 * ==================
 */

var Notification = new keystone.List('Notification');

Notification.add({
	title: { type: String, label: 'Заголовок', required: true, initial: true, },
	sender: { type: Types.Email, label: 'Адресат', required: true, initial: true, },
	text: { type: Types.Markdown, label: 'Текст', required: true, initial: true, },
	language: { type: Types.Select, options: 'ru, en', default: 'ru', label: 'Язык письма', required: true, initial: true, }
});

Notification.schema.post('save', (notification, next) => {
	if (!notification) {
		console.warn('empty notification');
		return next();
	}
	console.warn('trying to send notification');
	try {
		sendEmail({
			templateName: 'guest-custom-notification',
			to: notification.sender,
			subject: notification.title
		},
		{
			data: notification.text.html,
			language: notification.language
		});
		console.warn('sent notification');
		return next();
	} catch (error) {
		console.warn('sent notification error', error);
		return next();
	}
});

Notification.register();
