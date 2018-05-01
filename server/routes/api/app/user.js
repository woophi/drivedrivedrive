var async = require('async'),
	keystone = require('keystone'),
  User = keystone.list('User');

exports.signin = function(req, res) {

  async.series([

    function(cb) {

      User.model.findOne().where('email', req.body.email).exec(function(err, user) {
        if (err) return res.apiError(err);
        if (!user) {
          return res.apiError({message: "Sorry, user not found" });
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
