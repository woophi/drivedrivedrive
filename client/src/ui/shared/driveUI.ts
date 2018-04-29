import { CSSProperties } from 'react'; // better typings for css rules

const mobile = (content: CSSProperties, maxWidth?: string) => ({
  [`@media screen and (max-width: ${maxWidth ? maxWidth : '768px'})`]: {
    ...content
  }
});

const desktop = (content: CSSProperties, minWidth?: string) => ({
  [`@media screen and (min-width: ${minWidth ? minWidth : '769px'})`]: {
    ...content
  }
});

const media = (content: CSSProperties, media?: string) => ({
  [media]: {
    ...content
  }
});

const driveColors = { // theme.palette
  dark: '#181C20',
  text: '#2E363E',
  grayText: '#646E78',
  grayBg: '#A0AAB4',
  line: '#B4BEC8',
  light: '#D6DADE',
  chat: '#F0F4F7',
  /**
   * :hover and :selected
   */
  bg: '#D6DADE',
  disabled: '#D6DADE',
  darkHover: '#24282B',

  blue: '#71b8be',
  brand: '#76ABDC',
  green: '#8cc643',
  yellow: '#fbd105',
  red: '#FF5A32',
  lightGreen: '#aed580',
};

const driveStyles = { // theme.common
  radius: '8px',
  driveRadius: '1px 16px 16px 16px',
  border: `1px solid ${driveColors.line}`,
  shadow: '0 0 4px rgba(0, 0, 0, .3)',
  width: ' 23vw', // ?
};

/* Theme to app styles convention convertation BEGIN */
const heading: CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 'normal'
};

const textLine: CSSProperties = {
  wordBreak: 'break-all',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden'
};

const block: CSSProperties = {
  fontSize: '14px',
  boxSizing: 'border-box',
  padding: '.5rem',
  backgroundColor: '#fff',
  borderRadius: driveStyles.radius,
  boxShadow: driveStyles.shadow,
};

const modal: CSSProperties = {
  ...block,
  padding: '2rem 4rem 3rem',
  display: 'flex',
  maxWidth: '600px',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  pointerEvents: 'all',
  '& > h1': {
    ...heading
  }
};

const genericButton: CSSProperties = {
  outline: 'none !important',
  border: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  boxSizing: 'border-box',
  alignItems: 'center',
  textAlign: 'center',
  height: '2rem',
  minWidth: '7rem', // !!
  fontSize: '14px',
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
    boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.4)'
  },
  transition: '.2s ease',
  borderRadius: driveStyles.radius,
  backgroundColor: '#FFFFFF',
  color: driveColors.text,
};

const flatButton: CSSProperties = {
  ...genericButton,
  ':active': {
    backgroundColor: driveColors.light,
  }
};

const button: CSSProperties = {
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

const primaryButton: CSSProperties = {
  ...button,
  backgroundColor: driveColors.blue,
  color: '#FFFFFF'
};

const disabledButton: CSSProperties = {
  ...button,
  backgroundColor: '#FFFFFF',
  color: driveColors.grayText,
  cursor: 'default',
  ':hover': {},
  ':active': {},
};

const iconButton: CSSProperties = {
  ...button,
  padding: 0,
  userSelect: 'none',
  height: '2rem',
  minWidth: '2rem',
  width: '2rem',
  lineHeight: 1,
  '>i:first-child': {},
};

const primaryIconButton: CSSProperties = {
  ...iconButton,
  backgroundColor: driveColors.blue,
  color: '#FFFFFF'
};

const flatIconButton: CSSProperties = {
  ...flatButton,
  userSelect: 'none',
  height: '2rem',
  minWidth: '2rem',
  width: '2rem',
  '>i:first-child': {},
};

const input: CSSProperties = {
  height: '2rem',
  width: '100%',
  color: driveColors.text,
  fontSize: '13px',
  fontWeight: 'normal',
  textOverflow: 'ellipsis',
  padding: '.5rem',
  borderRadius: driveStyles.radius,
  border: driveStyles.border,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border 0.2s ease',
  ':disabled': {
    backgroundColor: driveColors.disabled
  }
};
/* Theme to app styles convention convertation END */

const listItem: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '4px 8px',
  fontSize: '13px',
  transition: 'background-color 0.1s ease',
  cursor: 'pointer',
  boxSizing: 'border-box',
  '&.active': {
    backgroundColor: driveColors.bg
  },
  ':hover': {
    backgroundColor: driveColors.bg
  },
  ':hover:active': {
    backgroundColor: driveColors.bg
  },
};

const toggle = (size?: 'sm'): CSSProperties => ({
  width: size === 'sm' ? 26 : 44,
  height: size === 'sm' ? 16 : 28,
  outline: 'none',
  borderRadius: 26,
  cursor: 'pointer',
  appearance: 'none',
  verticalAlign: 'top',
  position: 'relative',
  backgroundColor: driveColors.grayBg,
  border: `1px solid ${driveColors.grayBg}`,
  boxShadow: `inset 0 0 0 1px ${driveColors.grayBg}`,
  transition: 'border .25s .15s, box-shadow .25s .3s, padding .25s',
  '&:after': {
    top: size === 'sm' ? 0 : 1,
    left: size === 'sm' ? 0 : 1,
    right: size === 'sm' ? 10 : 16,
    height: size === 'sm' ? 14 : 24,
    content: '""',
    display: 'block',
    borderRadius: 24,
    position: 'absolute',
    backgroundColor: 'white',
    transition: 'border .25s .15s, left .25s .1s, right .15s .175s',
    boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.05), 0 0 0 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.05)',
  },
  '&:checked': {
    paddingLeft: 18,
    borderColor: driveColors.green,
    boxShadow: `inset 0 0 0 13px ${driveColors.green}`,
    transition: 'border .25s, box-shadow .25s, padding .25s .15s',
    '&:after': {
      right: size === 'sm' ? 0 : 1,
      left: size === 'sm' ? 10 : 16,
      borderColor: driveColors.green,
      transition: 'border .25s, left .15s .25s, right .25s .175s'
    }
  }
});

const fadeToBottom: CSSProperties = {
  '&:after': {
    position: 'absolute',
    height: '1.5rem',
    bottom: 0,
    left: '10px',
    right: '10px',
    content: '""',
    display: 'block',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFF 100%)',
    pointerEvents: 'none'
  }
};

const section: CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: '1rem',
  overflowY: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  ...mobile({
    overflowY: 'auto'
  })
};

const disabledScrollbars: CSSProperties = {
  '&': {
    overflow: 'initial !important',
    '> div:first-child': {
      overflow: 'initial !important',
      position: 'relative !important'
    }
  }
};

const checkBox: CSSProperties = {
  position: 'absolute', // take it out of document flow
  opacity: 0, // hide it

  '& + label': {
    position: 'relative',
    cursor: 'pointer',
    padding: 0,
  },

  // Box.
  '& + label:before': {
    content: '""',
    marginRight: '10px',
    display: 'inline-block',
    verticalAlign: 'text-top',
    width: '20px',
    height: '20px',
    backgroundColor: 'white'
  },

  // Box focus
  '&:focus + label:before': {
    boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.12)'
  },

  // Box checked
  '&:checked + label:before': {
    backgroundColor: 'white',
  },

  // Disabled state label.
  '&:disabled + label': {
    color: driveColors.disabled,
    cursor: 'auto'
  },

  // Disabled box.
  '&:disabled + label:before': {
    boxShadow: 'none',
    backgroundColor: driveColors.disabled
  },

  // Checkmark. Could be replaced with an image
  '&:checked + label:after': {
    content: '""',
    width: '8px',
    height: '8px',
    backgroundColor: driveColors.green,
    position: 'absolute',
    top: '6px',
    left: '6px',
    transition: 'all 0.2s ease'
  }
};

export const driveTheme = {
  common: {
    backgroundColor: driveColors.bg,
    color: driveColors.text,
    border: driveStyles.border,
    radius: driveStyles.radius,
    driveRadius: driveStyles.driveRadius,
    fontSize: '14px',
    shadow: driveStyles.shadow,
    topbarBackground: driveColors.text,
    leftBarBackground: driveColors.text,
    fadeToBottom,
    disabledScrollbars
  },
  items: {
    heading,
    textLine,
    block,
    modal,
    input,
    button,
    flatButton,
    iconButton,
    primaryIconButton,
    flatIconButton,
    primaryButton,
    disabledButton,
    listItem,
    toggle,
    section,
    checkBox
  },
  palette: driveColors,
  media,
  mobile,
  desktop,
};

export type DriveTheme = typeof driveTheme;
