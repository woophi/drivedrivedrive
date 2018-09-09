var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Mail Model
 * mails wich don't work on check via dns ping
 * ==================
 */

var Mail = new keystone.List('Mail');

Mail.add({
	domain: { type: String, label: 'Mail domain'  },
});

Mail.register();
