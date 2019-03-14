const	keystone = require('keystone');
const { ROLES } = require('../lib/staticVars');

exports.getRoles = async (userId) => {
	const User = keystone.list('User').model;
	let roles = [];
	const user = await User.findById(userId);
	roles = user.isAdmin ? [ROLES.ADMIN] : [];
	roles = user.isSuperAdmin ? [...roles, ROLES.GODLIKE] : [...roles];
	roles = user.isActive ? [...roles, ROLES.DRVIER] : [...roles];
	return roles;
}

exports.requireUser = (req, res) => {
	if (!req.user) {
		keystone.set('prevUrl', req.url);
		res.redirect('/signin');
		return false;
	}
	return true;
};