const mainView = require('./ssr').templateView;

exports = module.exports = (req, res) => {
	res.render('default', {}, (e, html) => {
		const testReplace = html.replace('ALESHA', mainView);
		res.send(testReplace);
	})
};
