import { LanguageId } from '../UserAuthInfo';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoFront: any | null;
  photoSide: any | null;
  photoInside: any | null;
  driverPhoto: any | null;
  car: Car | null;
  notifications: Notifications | null;
  rating: number | null;
  language: LanguageId
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
