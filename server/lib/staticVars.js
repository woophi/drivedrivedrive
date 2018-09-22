const keystone = require('keystone');

exports.mailFrom = {
  name: 'Vettura',
  email: keystone.get('env') === 'production' ? 'no-reply@vettura.eu' : 'info@km-webstudio.xyz',
}

exports.secret = process.env.SECRET_BASE;

exports.unsubLink = (driver, uniqHash) => `${keystone.get('locals').host}/unsubscribe/${driver ? 'driver' : 'guest/' + uniqHash}`;

exports.Rstatus = Object.freeze({
	OPEN: 0,
  ASSIGNED: 1,
  CLOSED: 2,
  PROCESS: 3,
  INVALID: 4,
  CONFIRMED: 5,
  RATED: 6,
  RATING: 7,
  UNAUTHORIZED: -1,
  FORBIDDEN: -2
});