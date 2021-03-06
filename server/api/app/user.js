const async = require('async');
const	keystone = require('keystone');
const { identity } = require('../../identity/index');
const { isEmpty } = require('lodash');
const { sendEmail, trimSpaces } = require('../../lib/helpers');
const { apiError } = require('../../lib/errorHandle');
const { t } = require('../../resources');

exports.signin = (req, res) => {
	const email = req.body.email.toLowerCase();

	if(!req.body.secret) {
		return apiError(res, 403);
	}

  async.series([

    (cb) => {
			const User = keystone.list('User').model;

      User.findOne().where('email', email).exec(async (err, user) => {
        if (!user || err) {
					return apiError(res, 400, err);
        } else {
					const roles = await identity.getRoles(user._id);
					user.token = identity.setNewToken({ id: user._id, roles });
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
			return apiError(res, 400, err);
    });
  });
};

exports.auth = (req, res) => {

	if (!req.body.token)
		return apiError(res, 401);
	const User = keystone.list('User').model;

	const { verificaitionError, claims } = identity.verifyToken(req.body.token);
	if (verificaitionError)
		return apiError(res, 403, verificaitionError);

	User.findById(claims.id).exec((err, user) => {

		if (err || !user) {
			return apiError(res, 401, err);
		} else {
			const prevUrl = keystone.get('prevUrl');
			keystone.set('prevUrl', null);
			return res.apiResponse({
				userId: user.id || user._id,
				fullName: user.name,
				userName: user.email,
				roles: claims.roles,
				token: req.body.token,
				prevUrl,
				language: user.language
			});
		}

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
			token: user.token,
			language: user.language
    });
  }
  return res.apiResponse(null);
};

exports.register = (req, res) => {
  const user = req.user;
  const email = trimSpaces(req.body.email.toLowerCase());

  if (user) {
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
				!req.body.gdpr ||
				!req.body.language
			) {
				return apiError(res, 400);
      }

      return cb();

		},

    (cb) => {
			const Gdpr = keystone.list('Gdpr').model;
      Gdpr.findOne()
				.where('keyName', 'gdpr_2')
				.exec((err, result) => {
					if (err) {
						return apiError(res, 500, err);
					}
					if (!result) {
						return apiError(res, 404);
					}
					confirmedGDPR = result._id;
					return cb();
				});
    },

    (cb) => {
			const User = keystone.list('User').model;

      User.findOne({ email }, (err, user) => {

        if (err || user) {
					return apiError(res, 400, err);
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
				confirmedGDPR,
				language: req.body.language
      };
			const User = keystone.list('User').model;
      const newUser = new User(userData);

      newUser.save((err) => {
        if (err) {
					return apiError(res, 500, err);
        }
        return cb();
      });

		},

		(cb) => {
			const User = keystone.list('User').model;

      User.findOne().where('email', email).exec(async (err, user) => {
        if (err || !user) {
					return apiError(res, 500, err);
				}
				const roles = await identity.getRoles(user._id);
				user.token = identity.setNewToken({ id: user._id, roles });
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
			return apiError(res, 500, err);
    }

    const onSuccess = () => {
      return res.apiResponse(true);
    }

    const onFail = (e) => {
			return apiError(res, 500, e);
    }

    keystone.session.signin({ email, password: req.body.password }, req, res, onSuccess, onFail);

  });
};

exports.signout = (req, res) => {
  keystone.session.signout(req, res, (err) => {
		if (err) {
			return apiError(res, 500, err);
    }
    return res.apiResponse(true);
	});
};

exports.forgotPassword = (req, res) => {
	const email = req.body.email.toLowerCase();
	const User = keystone.list('User').model;

  User.findOne().where('email', email).exec((err, user) => {
    if (err || !user) {
			return apiError(res, 400, err);
    }

    user.resetPassword(req, res, (err) => {
      if (err) {
				return apiError(res, 500, err);
      } else {
        return res.apiResponse(true);
      }
    });

  });

};

const authChangePass = (req, res) => {
	const { claims, verificaitionError } = identity.verifyToken(req.body.key);
	let user = req.user;
	if (verificaitionError)
		return apiError(res, 403, verificaitionError);

	if (user._id.toString() !== claims.id)
		return apiError(res, 400);
	user.password = req.body.password;
	user.save((err) => {
		if (err) {
			return apiError(res, 500, err);
		}
		return res.apiResponse(true);
	});
}

exports.resetPassword = (req, res) => {

  if (req.body.password !== req.body.password_confirm) {
		return apiError(res, 412);
	}
	if (!req.user) {
		const User = keystone.list('User').model;

		User.findOne().where('resetPasswordKey', req.body.key).exec(async (err, user) => {
			if (err || !user) {
				return apiError(res, 400, err);
			}
			user.password = req.body.password;
			const roles = await identity.getRoles(user._id);
			user.token = identity.setNewToken({ id: user._id, roles });
			user.save((err) => {
				if (err) {
					return apiError(res, 500, err);
				}
				keystone.session.signin({ email: user.email, password: req.body.password }, req, res, () => {
					return res.apiResponse(true);
				}, (err) => {
					return apiError(res, 500, err);
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
			return apiError(res, 400, err);
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
			return apiError(res, 500, err);
    }
    if (!user) {
			return apiError(res, 403);
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
			rating: user.rating && user.isActive ? user.rating.realValue : null,
			language: user.language
    });
  });

};


exports.updateProfile = (req, res) => {
  const email = req.body.email.toLowerCase();
  if (!req.user) {
		return apiError(res, 403);
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
		'notifications.email': req.body.notifications.email,
		'language': req.body.language
	};

  updatedData = checkPhoto(req.body.driverPhoto) ? { ...updatedData, 'driverPhoto': req.body.driverPhoto } : updatedData;
  updatedData = checkPhoto(req.body.photoInside) ? { ...updatedData, 'photoInside': req.body.photoInside } : updatedData;
  updatedData = checkPhoto(req.body.photoSide) ? { ...updatedData, 'photoSide': req.body.photoSide } : updatedData;
  updatedData = checkPhoto(req.body.photoFront) ? { ...updatedData, 'photoFront': req.body.photoFront } : updatedData;

  req.user.getUpdateHandler(req).process(updatedData, {
    fields: 'name, email, phone, language, ' +
    'car.kind, driverPhoto, photoInside, photoSide, photoFront,' +
    'car.model, car.year, notifications.email',
    flashErrors: true
  }, (err) => {
		if (err) {
			return apiError(res, 500, err);
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
					return apiError(res, 500, err);
				}
				admins.forEach(admin => {
					sendEmail({
						templateName: 'admin-notify-new-driver',
						to: admin,
						subject: t('mails.subject.newDriver', {}, admin.language)
					},
					{
						user: req.user,
						driver: true,
						language: admin.language
					});
				});
      });
    }

    if (err) {
			return apiError(res, 500, err);
    }

    return res.apiResponse();
  });

};
