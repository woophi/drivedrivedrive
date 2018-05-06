export interface AuthInfo {
  token: string;
}

export interface UserAuthInfo extends AuthInfo {
  userId: number;
  fullName: string;
  userName: string;
  roles: string[];
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
