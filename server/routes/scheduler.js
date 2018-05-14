const keystone = require('keystone');
const schedule = require('node-schedule');
const { sendEmailToPastRequests, notifyBeforeTransfer } = require('./tasks');

exports.schedulerWorker = () => {
	const devPattern = '1 * * * * *';
	const prodPattern = '07 09 * * *';
	const getPatternTime = keystone.get('env') === 'production' || keystone.get('env') === 'staging' ?
		prodPattern : devPattern;
	schedule.scheduleJob(getPatternTime, async () => {
		console.log('The answer to life, the universe, and everything!');
		await sendEmailToPastRequests();
		await notifyBeforeTransfer();
	});
}

