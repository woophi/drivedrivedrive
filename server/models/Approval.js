var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Approval Model
 * ==================
 */

var Approval = new keystone.List('Approval', {
	map: {name: 'approvedTime'}
});

Approval.add({
	approvedBy: { type: Types.Relationship, ref: 'User', label: 'Одобрено пользователем' },
	approvedRequest: { type: Types.Relationship, ref: 'Request', index: true, label: 'Одобренная заявка' },
	approvedTime: { type: Types.Datetime, noedit: true, label: 'Время одобрения' },
});

Approval.relationship({ ref: 'Request', path: 'approved', refPath: 'approved' });

Approval.defaultColumns = 'approvedTime, approvedBy, approvedRequest';
Approval.register();
