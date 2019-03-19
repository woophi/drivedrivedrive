const ru = require('./ru');
const en = require('./en');

const transl = {
	ru,
	en
};

let requiredLang = 'ru';

exports.t = (stringKey, param, language = requiredLang) => {
	try {
		const keys = stringKey.split('.');
		let requiredText = transl[language];
		keys.forEach(key => {
			requiredText = requiredText[key];
		});

		const findParamsInField = requiredText.match(/{{\s*.*?}}/g);
		if (findParamsInField && findParamsInField.length) {


			findParamsInField.forEach(paramField => {
				const sanytizeField = paramField.replace(/[{{|}}}]+/g, '');
				const onChangeParam = !!param[sanytizeField]
					? param[sanytizeField]
					: '';
				requiredText = requiredText.replace(paramField, onChangeParam);
			});
		}
		return requiredText;
	} catch (error) {
		return stringKey;
	}
}