var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Approval Model
 * ==================
 */

var Approval = new keystone.List('Approval', {
	map: {name: 'approvedBy'}
});

Approval.add({
	approvedBy: { type: Types.Relationship, ref: 'User', label: 'Одобрено пользователем' },
	approvedRequest: { type: Types.Relationship, ref: 'Request', index: true, label: 'Одобренная заявка' }
});

Approval.relationship({ ref: 'Request', path: 'approved', refPath: 'approved' });

Approval.defaultColumns = 'approvedBy, approvedRequest';
Approval.register();
