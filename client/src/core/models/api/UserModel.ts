export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoFront: string | null;
  photoSide: string | null;
  photoInside: string | null;
  driverPhoto: string | null;
  car: Car | null;
  notifications: Notifications | null;
  rating: number | null;
}

export interface Car {
  kind: string;
  year: number;
  model: string;
}

export interface Notifications {
  email: boolean;
  sms: boolean;
}
