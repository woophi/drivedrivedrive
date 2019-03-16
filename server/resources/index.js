const ru = require('./ru');
const en = require('./en');

const transl = {
	ru,
	en
};

let requiredLang = 'ru';

/**
 * for each registered user set uniq language,
 * he/she can change it in ui,
 * by default it set to ru
 *
 * for guest who doesn't have account
 * i can get prefered language from request
 * but i should have hash table with key value pairs
 * where key is request/audit id and
 * value is prefered lang.
 * to prevent overgrowth of ram with this table,
 * should i save it to db, or somehow clear it when request is over.
 *
 * but what if guest will come again to proceed with rating
 *
 *
 * problem -> i don't want to have a lang param in t function,
 * but i can
 *
 * */

exports.changeLanguage = (lang) => requiredLang = lang;
exports.getLanguage = () => requiredLang ;

exports.t = (stringKey, ...param) => {
	try {
		const keys = stringKey.split('.');
		let requiredText = transl[requiredLang];
		keys.forEach(key => {
			requiredText = requiredText[key];
		});
		const findParamsInField = requiredText.match(/{{\s*.*?\s*}}/g);
		if (findParamsInField && findParamsInField.length) {
			findParamsInField.forEach((paramField, i) => {
				const onChangeParam = !!param[i]
					? param[i]
					: '';
				requiredText = requiredText.replace(paramField, onChangeParam);
			});
		}
		return requiredText;
	} catch (error) {
		return stringKey;
	}
}