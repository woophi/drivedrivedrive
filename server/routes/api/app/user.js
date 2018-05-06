var async = require('async'),
	keystone = require('keystone'),
  User = keystone.list('User');

exports.signin = function(req, res) {

  async.series([

    function(cb) {

      User.model.findOne().where('email', req.body.email).exec(function(err, user) {
        if (err) return res.apiError(err);
        if (!user) {
          return res.apiError({message: "Извините, пользователь не найден" });
        } else {
          let result = user;
          if (result.resetPasswordKey) {
            result.resetPasswordKey = '';
            result.save(function(err) {
              if (err) return cb(err);
              return cb();
            });
          } else {
            return cb();
          }
        }
      });
    }
  ], function(err) {

    keystone.session.signin({ email: req.body.email, password: req.body.secret }, req, res, function(user) {

      return res.apiResponse({
        token: user._id
      });

    }, function(err) {

      return res.apiError({
        message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
      });

    });
  });
};

exports.auth = function(req, res) {

  User.model.findById(req.body.token).exec(function(err, user) {

		if (err || !user) {
			return res.apiError({
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		} else {
      let roles = [];

      roles = user.isAdmin ? ['Admin'] : [];
      roles = user.isSuperAdmin ? [...roles, 'Godlike'] : [...roles];
      roles = user.isActive ? [...roles, 'Driver'] : [...roles];

      return res.apiResponse({
        userId: user.id || user._id,
        fullName: user.name,
        userName: user.email,
        roles
      });
    }

	});
};

exports.checkAuth = function(req, res) {
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
      roles
    });
  }
  return res.apiResponse(null);
};

exports.register = function(req, res) {
  const user = req.user;

  if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}

  async.series([

    function(cb) {

      if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.phone) {
        return res.apiError({
          message: (err && err.message ? err.message : false) || 'Все поля обязательны к заполнению'
        });
      }

      return cb();

    },

    function(cb) {

      User.model.findOne({ email: req.body.email }, function(err, user) {

        if (err) {
          return res.apiError({
            message: (err && err.message ? err.message : false) || 'Пользователь с таким email уже существует'
          });
        }

        if (user) {
          return res.apiError({
            message: (err && err.message ? err.message : false) || 'Пользователь с таким email уже существует'
          });
        }

        return cb();

      });

    },

    function(cb) {

      var userData = {
        name: {
          first: req.body.firstname,
          last: req.body.lastname,
        },
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
      };

      var User = keystone.list('User').model,
        newUser = new User(userData);

      newUser.save(function(err) {
        if (err) {
          return res.apiError({
            message: (err && err.message ? err.message : false) || 'Ошибка при регистрации нового пользователя'
          });
        }
        return cb();
      });

    }

  ], function(err){

    if (err) {
      return res.apiError({
        message: (err && err.message ? err.message : false) || 'Что-то пошло не так, попробуйте снова'
      });
    }

    var onSuccess = function() {
      return res.apiResponse(true);
    }

    var onFail = function(e) {
      return res.apiError({
        message: (err && err.message ? err.message : false) || 'Что-то пошло не так, попробуйте снова'
      });
    }

    keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

  });
};

exports.signout = function(req, res) {
  keystone.session.signout(req, res, function(err) {
		if (err) {
      return res.apiError({
        message: (err && err.message ? err.message : false) || 'Что-то пошло не так, попробуйте снова'
      });
    }
    return res.apiResponse(true);
	});
};
