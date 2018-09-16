exports = module.exports = (req, res) => {
	res.render('default', {}, (e, html) => {
		res.send(html);
	})
};
