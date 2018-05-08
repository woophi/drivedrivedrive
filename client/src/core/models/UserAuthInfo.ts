export interface AuthInfo {
  token: string;
}

export interface UserAuthInfo extends AuthInfo {
  userId: string;
  fullName: FullName;
  userName: string;
  roles: string[];
}

export interface FullName {
  first: string;
  last: string;
}

export interface LoginInfo {
  email: string;
  secret: string;
}

export interface NewUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
}

export interface PasswordForgot {
  email: string;
}

export interface PasswordReset {
  key: string;
  password: string;
  password_confirm: string;
}

export interface PasswordKey {
  key: string;
}

export interface UseProfile {
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
