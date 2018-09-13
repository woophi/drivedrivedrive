const async = require('async');
const	keystone = require('keystone');
const { secret } = require('../../lib/staticVars');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');
const { sendEmail, apiError } = require('../../lib/helpers');

exports.signin = (req, res) => {
	const email = req.body.email.toLowerCase();

	if(!req.body.secret) {
		return apiError(res, {message: 'Введите пароль' }, 403);
	}

  async.series([

    (cb) => {
			const User = keystone.list('User').model;

      User.findOne().where('email', email).exec((err, user) => {
        if (!user || err) {
					return apiError(res, {message: "Извините, ошибка входа" }, 400);
        } else {
					const token = jwt.sign({ id: user._id }, secret, {
						expiresIn: 86400
					});
					user.token = token;
					if (user.resetPasswordKey) {
						user.resetPasswordKey = '';
					}
					user.save((err) => {
						if (err) {
							return cb(err);
						}
						return cb();
					});
        }
      });
    }
  ], (err) => {

    keystone.session.signin({ email, password: req.body.secret }, req, res, (user) => {

      return res.apiResponse({
        token: user.token
      });

    }, (err) => {
			return apiError(res, {
        message: 'Извините, не удалось зайти, пожалуйста попробуйте снова.'
      }, 400);
    });
  });
};

exports.auth = (req, res) => {

	if (!req.body.token) return res.status(401).send({ auth: false, message: 'No token provided.' });
	const User = keystone.list('User').model;

  jwt.verify(req.body.token, secret, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

		User.findById(decoded.id).exec((err, user) => {

			if (err || !user) {
				return apiError(res, {
					message: 'Авторизация не удалась'
				}, 401);
			} else {
				let roles = [];

				roles = user.isAdmin ? ['Admin'] : [];
				roles = user.isSuperAdmin ? [...roles, 'Godlike'] : [...roles];
				roles = user.isActive ? [...roles, 'Driver'] : [...roles];

				return res.apiResponse({
					userId: user.id || user._id,
					fullName: user.name,
					userName: user.email,
					roles,
					token: req.body.token
				});
			}

		});
	});
};

exports.checkAuth = (req, res) => {
  const user = req.user;

  if (user) {
    let roles = [];

    roles = user.isAdmin ? ['Admin'] : [];
    roles = user.isSuperAdmin ? [...roles, 'Godlike'] : [...roles];
    roles = user.isActive ? [...roles, 'Driver'] : [...roles];

    return res.apiResponse({
      userId: user.id || user._id,
      fullName: user.name,
      userName: user.email,
			roles,
			token: user.token
    });
  }
  return res.apiResponse(null);
};

exports.register = (req, res) => {
  const user = req.user;
  const email = req.body.email.toLowerCase();

  if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}

	let confirmedGDPR;

  async.series([

    (cb) => {

      if (
				!req.body.firstname ||
				!req.body.lastname ||
				!email ||
				!req.body.password ||
				!req.body.phone ||
				!req.body.gdpr
			) {
				return apiError(res, {
					message: 'Все поля обязательны к заполнению'
				}, 400);
      }

      return cb();

		},

    (cb) => {
			const Gdpr = keystone.list('Gdpr').model;
      Gdpr.findOne()
				.where('keyName', 'gdpr_2')
				.exec((err, result) => {
					if (err) {
						return apiError(res, {message: 'Системная ошибка' }, 500);
					}
					if (!result) {
						return apiError(res, {message: 'Извините, согласие не найдено' }, 404);
					}
					confirmedGDPR = result._id;
					return cb();
				});
    },

    (cb) => {
			const User = keystone.list('User').model;

      User.findOne({ email }, (err, user) => {

        if (err || user) {
					return apiError(res, {message: 'Ошибка при регистрации нового пользователя' }, 400);
        }

        return cb();

      });

    },

    (cb) => {

      const userData = {
        name: {
          first: req.body.firstname,
          last: req.body.lastname,
        },
        email,
        password: req.body.password,
				phone: req.body.phone,
				confirmedGDPR
      };
			const User = keystone.list('User').model;
      const newUser = new User(userData);

      newUser.save((err) => {
        if (err) {
					return apiError(res, {message: 'Ошибка при регистрации нового пользователя' }, 500);
        }
        return cb();
      });

		},

		(cb) => {
			const User = keystone.list('User').model;

      User.findOne().where('email', email).exec((err, user) => {
        if (err || !user) {
					return apiError(res, {message: 'Ошибка сервера' }, 500);
        }
				const token = jwt.sign({ id: user._id }, secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				user.token = token;
				user.save((err) => {
					if (err) {
						return cb(err);
					}
					return cb();
				});
      });
    }

  ], (err) => {

    if (err) {
			return apiError(res, {message: 'Что-то пошло не так, попробуйте снова' }, 500);
    }

    const onSuccess = () => {
      return res.apiResponse(true);
    }

    const onFail = (e) => {
			return apiError(res, {message: 'Ошибка входа, попробуйте снова зайти в аккаунт' }, 500);
    }

    keystone.session.signin({ email, password: req.body.password }, req, res, onSuccess, onFail);

  });
};

exports.signout = (req, res) => {
  keystone.session.signout(req, res, (err) => {
		if (err) {
			return apiError(res, {message: 'Что-то пошло не так, попробуйте снова' }, 500);
    }
    return res.apiResponse(true);
	});
};

exports.forgotPassword = (req, res) => {
	const email = req.body.email.toLowerCase();
	const User = keystone.list('User').model;

  User.findOne().where('email', email).exec((err, user) => {
    if (err || !user) {
			return apiError(res, {message: 'Не удалось отправить ссылку для сброса пароля' }, 400);
    }

    user.resetPassword(req, res, (err) => {
      if (err) {
				return apiError(res, {message: 'Не удалось сбросить пароль' }, 500);
      } else {
        return res.apiResponse(true);
      }
    });

  });

};

const authChangePass = (req, res) => {
	return jwt.verify(req.body.key, secret, (err, decoded) => {
		let user = req.user;
    if (err)
			return res.status(500).send({ message: 'Failed to authenticate token.' });

		if (user._id.toString() !== decoded.id)
			return res.status(400).send({ message: 'Не удалось изменить пароль' });
		user.password = req.body.password;
		user.save((err) => {
			if (err) {
				return apiError(res, {message: 'Не удалось изменить пароль' }, 500);
			}
			return res.apiResponse(true);
		});
	});
}

exports.resetPassword = (req, res) => {

  if (req.body.password !== req.body.password_confirm) {
		return apiError(res, {message: 'Пароли не совпадают' }, 412);
	}
	if (!req.user) {
		const User = keystone.list('User').model;

		User.findOne().where('resetPasswordKey', req.body.key).exec((err, user) => {
			if (err || !user) {
				return apiError(res, {message: 'Ссылка для сброса пароля недействительна', status: false }, 400);
			}
			user.password = req.body.password;
			const token = jwt.sign({ id: user._id }, secret, {
				expiresIn: 86400
			});
			user.token = token;
			user.save((err) => {
				if (err) {
					return apiError(res, {message: 'Не удалось сбросить пароль' }, 500);
				}
				keystone.session.signin({ email: user.email, password: req.body.password }, req, res, () => {
					return res.apiResponse(true);
				}, (err) => {
					return apiError(res, {
						message: 'Извините, не удалось зайти, пожалуйста попробуйте снова.'
					}, 500);
				});
			})
				.then(user => {
					if (!user)
						return;
					let result = user;
					result.resetPasswordKey = '';
					result.save((err) => {
						if (err) console.error('опустошение ключа не прошло', JSON.stringify(err));
					});
				});
		});
	} else {
		authChangePass(req, res)
	}
};

exports.getPasswordKey = (req, res) => {
	const User = keystone.list('User').model;

  User.findOne().where('resetPasswordKey', req.body.key).exec((err, key) => {
    if (err || !key) {
			return apiError(res, {message: 'Ссылка для сброса пароля недействительна', status: false }, 400);
    }
    return res.apiResponse({
      status: true
    });
  });

};

exports.getProfile = (req, res) => {
	const User = keystone.list('User').model;

  User.findById(req.body.userId).exec((err, user) => {
    if (err) {
			return apiError(res, {message: 'Невозможно получить данные' }, 500);
    }
    if (!user) {
			return apiError(res, {message: 'Невозможно получить данные' }, 403);
    }
    return res.apiResponse({
      firstName: user.name.first,
      lastName: user.name.last,
      email: user.email,
      phone: user.phone,
      photoFront: user.photoFront ? user.photoFront.secure_url : null,
      photoSide: user.photoSide ? user.photoSide.secure_url : null,
      photoInside: user.photoInside ? user.photoInside.secure_url : null,
      driverPhoto: user.driverPhoto ? user.driverPhoto.secure_url : null,
      car: user.car ? user.car : null,
      notifications: user.notifications,
      rating: user.rating && user.isActive ? user.rating.realValue : null
    });
  });

};


exports.updateProfile = (req, res) => {
  const email = req.body.email.toLowerCase();
  if (!req.user) {
		return apiError(res, {message: 'Невозможно обновить данные' }, 403);
  }

  const checkPhoto = (photo) => {
    if (!photo || typeof photo === 'string') {
      return null;
    } else {
      return photo;
    }
	}

	const carObj = isEmpty(req.body.car) ? {} : req.body.car;

  let updatedData = {
    'name.first': req.body.firstName,
    'name.last': req.body.lastName,
    'email': email,
    'phone': req.body.phone,
    'car.kind': carObj.kind,
    'car.model': carObj.model,
		'car.year': carObj.year,
		'notifications.email': req.body.notifications.email
	};

  updatedData = checkPhoto(req.body.driverPhoto) ? { ...updatedData, 'driverPhoto': req.body.driverPhoto } : updatedData;
  updatedData = checkPhoto(req.body.photoInside) ? { ...updatedData, 'photoInside': req.body.photoInside } : updatedData;
  updatedData = checkPhoto(req.body.photoSide) ? { ...updatedData, 'photoSide': req.body.photoSide } : updatedData;
  updatedData = checkPhoto(req.body.photoFront) ? { ...updatedData, 'photoFront': req.body.photoFront } : updatedData;

  req.user.getUpdateHandler(req).process(updatedData, {
    fields: 'name, email, phone,' +
    'car.kind, driverPhoto, photoInside, photoSide, photoFront,' +
    'car.model, car.year, notifications.email',
    flashErrors: true
  }, (err) => {
		if (err) {
			return apiError(res, {message: 'Не удалось обновить профиль' }, 500);
		}

    const requiredUser = (!!req.user.photoFront.public_id
      && !!req.user.photoSide.public_id
      && !!req.user.photoInside.public_id && !!req.user.driverPhoto.public_id
      && !req.user.isActive && !!req.user.notifications.email
      && !!req.user.car.model && !!req.user.car.year && !!req.user.car.kind
      && (!req.user.isAdmin || !req.user.isSuperAdmin)
    );

    if (requiredUser) {
			const User = keystone.list('User').model;

      User.find().where('isAdmin', true).exec((err, admins) => {
        if (err) {
					return apiError(res, {message: 'Не удалось получить данные' }, 500);
				}
				sendEmail({
					templateName: 'admin-notify',
					to: admins,
					subject: `Новый водитель`
				},
				{
					user: req.user,
					driver: true
				});
      });
    }

    if (err) {
			return apiError(res, {message: 'Не удалось обновить данные' }, 500);
    }

    return res.apiResponse();
  });

};
