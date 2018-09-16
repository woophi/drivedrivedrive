import { IStyle } from 'react-fela';

const mobile = (content: IStyle, maxWidth?: string) => ({
  [`@media screen and (max-width: ${maxWidth ? maxWidth : '768px'})`]: {
    ...content
  }
});

const mobileEarly = (content: IStyle, maxWidth?: string) => ({
  [`@media screen and (max-width: ${maxWidth ? maxWidth : '973px'})`]: {
    ...content
  }
});

const driveColors = {
  dark: '#181C20',
  text: '#2E363E',
  grayText: '#646E78',
  grayBg: '#A0AAB4',
  line: '#B4BEC8',
  light: '#D6DADE',
  bg: '#D6DADE',
  disabled: '#D6DADE',
  darkHover: '#24282B',

  blue: '#71b8be',
  brand: 'rgb(0, 188, 212)',
  green: '#8cc643',
  yellow: '#fbd105',
  red: '#FF5A32',
  lightGreen: '#aed580',
  lightYellow: '#BDBF37'
};

const genericButton: IStyle = {
  outline: 'none !important',
  border: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  boxSizing: 'border-box',
  alignItems: 'center',
  textAlign: 'center',
  height: '2rem',
  minWidth: '7rem', // !!
  fontSize: '1rem',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  padding: '0.25rem 0.75rem',
  '&:not(button)': {
    display: 'flex',
    justifyContent: 'center'
  },
  '>i:first-child': {
    marginRight: '0.5rem'
  },
  ':hover': {
    boxShadow: '0px 0px 6px 0px rgba(0,0,0,1)'
  },
  transition: '.2s ease',
  borderRadius: '8px',
  backgroundColor: '#FFFFFF',
  color: driveColors.text,
};

const flatButton: IStyle = {
  ...genericButton,
  ':disabled': {
    backgroundColor: driveColors.disabled,
    color: '#FFFFFF',
    cursor: 'not-allowed'
  },
  ':active': {
    backgroundColor: driveColors.light,
  },
};

const button: IStyle = {
  ...genericButton,
  lineHeight: 1,
  boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.4)',
  marginBottom: '2px',
  ':active:not(:disabled)': {
    boxShadow: '0px 0 3px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(2px)'
  },
  ':disabled': {
    backgroundColor: '#FFFFFF',
    color: driveColors.grayText,
    cursor: 'default',
    pointerEvents: 'none'
  }
};

const primaryButton: IStyle = {
  ...button,
  backgroundColor: driveColors.lightYellow,
  color: '#FFFFFF',
  borderRadius: '1rem',
};

const disabledButton: IStyle = {
  ...button,
  backgroundColor: '#FFFFFF',
  color: driveColors.grayText,
  cursor: 'default',
  ':hover': {},
  ':active': {},
};

const iconButton: IStyle = {
  ...button,
  padding: 0,
  userSelect: 'none',
  height: '2rem',
  minWidth: '2rem',
  width: '2rem',
  lineHeight: 1,
  '>i:first-child': {},
};

const primaryIconButton: IStyle = {
  ...iconButton,
  backgroundColor: driveColors.blue,
  color: '#FFFFFF'
};

const flatIconButton: IStyle = {
  ...flatButton,
  userSelect: 'none',
  height: '2rem',
  minWidth: '2rem',
  width: '2rem',
  '>i:first-child': {},
};

export const driveTheme = {
  common: {
    backgroundColor: driveColors.bg,
    color: driveColors.text,
    fontSize: '14px',
    topbarBackground: driveColors.text,
    leftBarBackground: driveColors.text,
  },
  items: {
    button,
    flatButton,
    iconButton,
    primaryIconButton,
    flatIconButton,
    primaryButton,
    disabledButton
  },
  palette: driveColors,
  mobile,
  mobileEarly
};

export type DriveTheme = typeof driveTheme;
