var keystone = require('keystone');

/**
 * Mail Model
 * mails wich don't work on check via dns ping
 * ==================
 */

var Mail = new keystone.List('Mail');

Mail.add({
	domain: { type: String, label: 'Mail domain'  },
	reason: { type: String, label: 'Причина'}
});

Mail.register();
