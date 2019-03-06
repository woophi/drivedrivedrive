export type Request = {
  _id: string,
  guest: GuestRequest,
	created: string,
  accepted: string,
  approved: string,
	assignedBy: string[],
	assignedPrices: string[],
	wasAssignedOn: string[],
	wasConfirmed: boolean,
  rated: boolean,
  confirmedGDPR: string,
	submitedOn?: string,
	submitedPrice?: string,
	wasConfirmedTime?: string,
  assignedRating?: string,
  assignedRatingTime?: number,
	notified?: string
};

export type GuestRequest = {
  name: string,
  email: string,
  count: number,
  from: string,
  to: string,
  date: string,
  time: string,
  comment: string,
  phone: string,
  notify: boolean
};
