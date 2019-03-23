import * as React from 'react';

export const Ru: React.SFC<{ inMenu?: boolean }> = ({ inMenu = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 9 6"
    height="24px"
    width="24px"
    style={inMenu ? {
      position: 'absolute',
      top: 0,
      left: '8px',
    }: {}}
  >
    <rect width="9" height="6" fill="#D52B1E" />
    <rect width="9" height="4" fill="#0039A6" />
    <rect width="9" height="2" fill="#f4efef" />
  </svg>
);
