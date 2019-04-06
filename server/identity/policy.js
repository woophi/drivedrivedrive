const	keystone = require('keystone');
const p = keystone.get('env') === 'production';

const getWiteList = () => {
	const list = process.env.ORIGIN_POLICY;
	if (!list)
		return '';
	if (list.includes(', ')) {
		return list.split(', ');
	}
	return list;
}
exports.corsOptions = {
  origin: (origin, callback) => {
		if (!p) {
			callback(null, true);
		} else if (getWiteList().indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed'));
    }
  }
}