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