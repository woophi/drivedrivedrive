module.exports = {
	'mails': {
		'subject': {
			'driverNewReq': 'New transfer request from {{from}} to {{to}}',
			'adminNewReq': 'New request on site from {{from}} to {{to}}',
			'guestNewReq': 'Your journey from {{from}} to {{to}}',
			'guestUpdateReq': 'Transfer {{from}} - {{to}} has been changed',
			'transfer': 'Transfer {{from}} - {{to}}',
			'transferConfirmed': 'Transfer {{from}} - {{to}} confirmed',
			'ratedReq': 'Transfer feedback {{from}} - {{to}}',
			'newDriver': 'New driver',
			'rateReq': 'Rate Your journey',
			'important': 'Important',
			'passwordReset': 'Reset password'
		},
		'hi': 'Hello {{recipient}}',
		'unsubscribe': 'Unsubscribe from mail list',
		'request': {
			'data': 'Transfer information',
			'count': 'number of passengers',
			'price': 'price {{price}} €(EUR)',
			'dateTime': 'date {{date}}, time {{time}}',
			'comment': 'Comment:',
			'phone': 'Contact phone number:',
			'choosenDriver': 'Choosen driver',
			'car': 'Car:',
			'client': 'Client -',
			'goFromTo': 'going to from {{from}} to {{to}}',
		},
		'accptReq': {
			'adminHi': 'Hi, client chose a driver.',
			'confirm': 'confirm',
			'clientWantsYou': 'Client wants to go with you',
			'driverHi': 'Hi, You price offer has been choosen by client',
			'driverWarn': 'In the near future we will contact you to confirm the trip.'
		},
		'newDriver': {
			'dataUpdate': 'New driver has recently update his data and uploaded all photos.',
			'link': 'Link to profile'
		},
		'newReq': {
			'appear': 'New request has recently been added',
			'info': 'From {{from}}, to {{to}}, date {{date}}, time {{time}}, passengers {{count}}',
			'validate': 'To validate request, please use the following',
			'link': 'link',
			'newTitle': 'New transfer',
			'linkToNew': 'Link to new transfer',
			'thx': 'Thank you for giving us the opportunity to serve you!',
			'uReq': 'We got Your transfer request, soon you will start receiving offers from our drivers.',
			'edit': 'If you want to change anything in your transfer, You could easily do it via following link.',
			'linkToU': 'Link to transfer request'
		},
		'confirmReq': {
			'confirmed': 'Transfer has been confirmed',
			'guestHi': 'Dear {{name}}, below you could find details for your ride',
			'tripFromTo': 'Journey from {{from}} to {{to}}'
		},
		'updateReq': {
			'title': 'Client changed request information.',
			'hi': 'Hi, client has recently updated request data',
			'newData': 'New information'
		},
		'password': {
			'title': 'You have recently requested password restore from web-site {{host}}.',
			'setNew': 'You can set new password by using the following link:'
		},
		'futureReq': {
			'title': 'Reminder of the upcoming journey',
			'reminder': 'Kindly remind You, tomorrow will be Your journey',
			'data': 'Information about Your transfer',
			'from': 'Departure',
			'to': 'Arrival'
		},
		'card': {
			'title': 'New price offer from driver',
			'ready': 'Dear {{clientName}}, I can offer you transfer service for required route from {{from}} to {{to}}',
			'price': 'Fixed price is {{price}} €(EUR) for one-way drive',
			'go': 'Let\'s go!',
			'clickHere': 'Press to choose this offer'
		},
		'rated': {
			'hi': 'Hi, client left feedback.',
			'transfer': 'Request - {{from}} - {{to}}.',
			'clientRate': 'Client {{name}} rated driver {{namefirst}} {{namelast}}',
			'driverGet': 'Driver has been rated:',
			'trip': 'Trip - {{trip}};',
			'car': 'Car - {{car}};',
			'driver': 'Driver - {{driver}};',
			'moreInfo': 'More information'
		},
		'rate': {
			'hi': 'Hi, {{name}}, how was Your journey?',
			'title': 'Can You take a survey and give us Your feedback. We would really appreciate it. It takes two minutes.',
			'action': 'To rate Your journey, please, press the button "rate"',
			'btn': 'Rate'
		}
	},
	'errors': {
		'request': {
			'notFound': 'Request wasn\'t found',
			'alreadyApproved': 'Request was approved',
			'newApproval': 'Cannot create new approval',
			'addApproval': 'Cannot attach approval to request',
			'new': 'Cannot create new request',
			'newAudit': 'Cannot create new audit',
			'addAudit': 'Cannot attach audit to request',
			'getData': 'Unable to get request data',
			'notifyClient': 'Cannot send notification mail to client',
			'addPrice': 'Cannot add price to request',
			'update': 'Cannot update request'
		},
		'user': {
			'driver': {
				'notFound': 'Cannot find drivers',
				'notSub': 'Driver has already unsubscribed', //HERE
				'unableToChoose': 'Cannot choose driver',
				'notFoundOne': 'Cannot find driver',
				'rate': 'Cannot rate driver'
			},
			'guest': {
				'notSub': 'User has already unsubscribed'//HERE
			},
			'admin': {
				'notFound': 'Cannot find admin users'
			}
		},
		'sub': {
			'update': 'Cannot update subscription status',
		},
		'gdpr': {
			'notFound': 'Sorry, gdpr wasn\'t found'
		},
		'price': {
			'notFound': 'Price wasn\'t found'
		},
		'rating': {
			'notFound': 'Rating wasn\'t found',
			'unableToUpdate': 'Cannot update rating',
			'self': 'Error with rating'
		},
		'account': {
			'noPassword': 'No password provided',
			'enter': 'Sorry, entry error',
			'tryAgain': 'Sorry, cannot sign in, please try again',
			'noToken': 'No token provided',
			'failToken': 'Error to authorize token',
			'failAuth': 'Fail to authorize',
			'registerFields': 'All fields are required',
			'new': 'Error to register new user',
			'logIn': 'Entry error, try again to sign in',
			'linkRecovery': 'Cannot send link to reset a password',
			'recoveryPassword': 'Cannot reset passsword',
			'changePassword': 'Cannot change password',
			'passwordNotMatch': 'Passwords don\'t match',
			'oldLinkRecovery': 'Link is invalid',
			'update': 'Cannot update profile'
		}
	},
	'admin': {
		'approval': {
			'approvedBy': 'Approved by',
			'approvedRequest': 'Approved request',
			'approvedTime': 'Approve time'
		},
		'audit': {
			'ip': 'IP address',
			'country': 'Country',
			'city': 'City',
			'language': 'Language',
			'auditRequest': 'Linked request'
		},
		'gdpr': {
			'title': 'Title',
			'text': 'Content',
			'keyName': 'Key'
		},
		'mail': {
			'domain': 'Mail domain',
			'reason': 'Reason'
		},
		'price': {
			'value': 'Price',
			'submitedBy': 'Submited by',
			'assignedRequest': 'Assigned request'
		},
		'rating': {
			'values': {
				'trip': 'Journey',
				'driver': 'Driver',
				'car': 'Car'
			},
			'comment': 'Comment',
			'open': 'Rating sent',
			'closed': 'Rating assigned',
			'assignedRequest': 'Rated request'
		},
		'request': {
			'guest': {
				'name': 'Name',
				'email': 'E-mail',
				'count': 'Number of passengers',
				'from': 'From',
				'to': 'To',
				'date': 'Data',
				'time': 'Time',
				'comment': 'Comment',
				'phone': 'Phone number',
				'notify': 'Subscribe on notifications'
			},
			'created': 'Request was created',
			'accepted': 'Водитель was choosen',
			'assignedBy': 'Responded',
			'assignedPrices': 'Assigned prices',
			'submitedOn': 'Submited driver',
			'submitedPrice': 'Submited price',
			'wasAssignedOn': 'Other drivers',
			'wasConfirmed': 'Request was confirmed',
			'wasConfirmedTime': 'Confirmation time',
			'assignedRating': 'Assigned rating',
			'rated': 'Request was rated',
			'notified': 'Notification was sent',
			'approved': 'Approved',
			'audit': 'Audit'
		},
		'user': {
			'name': 'Name Surname',
			'email': 'E-mail',
			'password': 'Password',
			'phone': 'Phone number',
			'driverUndCar': 'Driver and car',
			'photo': {
				'front': 'Front photo',
				'side': 'Side photo',
				'inside': 'Inside photo',
				'driver': 'Driver photo',
				'specialPhoto': 'Car photo for e-mail'
			},
			'car': {
				'kind': 'Brand',
				'year': 'Year',
				'model': 'Model'
			},
			'notification': 'Notifications',
			'role': {
				'title': 'User role',
				'admin': 'Administrator',
				'superAdmin': 'God like',
				'activeDriver': 'Active driver'
			},
			'rating': {
				'title': 'Rating',
				'nominalValue': 'Visible rating',
				'realValue': 'Real rating',
				'assignedRatings': 'Ratings'
			},
			'lang': 'Language'
		}
	}
}