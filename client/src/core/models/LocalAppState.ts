import { LanguageId } from './UserAuthInfo';

export interface LocalAppState {
  isMobile: boolean;
  loginProcessStep: number;
  loginFailMsg: string;
  lang: LanguageId;
}
