const keystone = require('keystone');

exports.mailFrom = {
  name: 'Vettura',
  email: keystone.get('env') === 'production' ? 'no-reply@vettura.eu' : 'info@km-webstudio.xyz',
}

exports.secret = process.env.SECRET_BASE;