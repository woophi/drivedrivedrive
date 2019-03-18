export interface Gdpr {
  title: string;
  keyName: KeyName;
  text: string;
}

export const enum KeyName {
  GUEST = 'gdpr_1',
  USER = 'gdpr_2',
  VISITOR = 'gdpr_3'
}
