var dns = require('dns'),
		net = require('net'),
		keystone = require('keystone'),
		MailDomain = keystone.list('Mail'),
	async = require('async');

const checkMailonPing = async (email, callback, timeout, from_email) => {
	timeout = timeout || 5000;
	from_email = from_email || email;

	const MAX_EMAIL_LEN = 300;
	if (MAX_EMAIL_LEN < email.length) {
		return callback(null, false);
	}
	if (!/^\S+@\S+$/.test(email)) {
		return callback(null, false);
	}

	await dns.resolveMx(email.split('@')[1], (err, addresses) => {
		if (err || addresses.length === 0) {
			return callback(err, false);
		}
		addresses = addresses.sort((a,b) => {
			return a.priority - b.priority
		})
		var res,undetermined;
		var cond = false, j =0;
		let dataOnPing;
		async.doWhilst((done) => {
			var conn = net.createConnection(25, addresses[j].exchange);
			var commands = [ "helo " + addresses[j].exchange, "mail from: <"+from_email+">", "rcpt to: <"+email+">" ];

			var i = 0;
			conn.setEncoding('ascii');
			conn.setTimeout(timeout);
			conn.on('error', () => {
				conn.emit('false');
			});
			conn.on('false', () => {
				res = false
				undetermined = false;
				cond = false;
				done(err, false);
				conn.removeAllListeners();
				conn.destroy();
			});
			conn.on('connect', () => {
				conn.on('prompt', () => {
					if(i < 3){
						conn.write(commands[i]);
						conn.write('\r\n');
						i++;
					} else {

						res = true;
						undetermined = false;
						cond = false;
						done(err, true);
						conn.removeAllListeners();
						conn.destroy(); //destroy socket manually
					}
				});
				conn.on('undetermined', () => {
					j++;
					//in case of an unrecognisable response tell the callback we're not sure
					cond = true;
					res = false;
					undetermined = true;
					done(err, false, true);

					conn.removeAllListeners();
					conn.destroy(); //destroy socket manually

				});
				conn.on('timeout', () => {
					conn.emit('undetermined');
				});
				conn.on('data', (data) => {

					if(data.indexOf("220") == 0 || data.indexOf("250") == 0 || data.indexOf("\n220") != -1 || data.indexOf("\n250") != -1) {
						conn.emit('prompt');
					} else if(data.indexOf("\n550") != -1 || data.indexOf("550") == 0) {
						dataOnPing = data;
						conn.emit('false');
					} else {
						conn.emit('undetermined');
					}
				});
			});
		}, () => {
			return j < addresses.length && cond
		}, (err) => {
			callback(err || dataOnPing, res);
		})
	});
};

exports.checkMails = (mail, res) => {
	checkMailonPing(mail, (error, validMail) => {
		const domain = mail.split('@')[1];
		if (error)
			console.error('err', error);

		if (validMail) {
			return res.apiResponse(true);
		} else {

			MailDomain.model
				.findOne()
				.where('domain', domain)
				.exec((err, result) => {
					if (err) {
						return res.apiError({message: 'Системная ошибка.' }, '', err, 500);
					}

					if (!!result)
						return res.apiResponse(true);

					mailDomainModel = new MailDomain({
						domain,
						reason: error
					});
					mailDomainModel.save((err) => {
						if (err) {
							return res.apiError({message: 'Проблема сохранить новый почтовый домен' }, '', err, 500);
						}
						return res.apiResponse(true);
					});


      	});
		}
	})
}