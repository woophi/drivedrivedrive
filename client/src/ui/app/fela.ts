import { CSSProperties } from 'react';
import { createRenderer } from 'fela';
import * as embedded from 'fela-plugin-embedded';
import webPreset from 'fela-preset-web';
import { driveTheme } from 'ui/shared/driveUI';

export function configureFela(mountNodeId: string) {
  const mountNode = document.getElementById(mountNodeId);

  const renderer = createRenderer({
    selectorPrefix: 'f_',
    plugins: [...webPreset, embedded.default() ],
    mediaQueryOrder: [
      'screen and (max-width: 1440px)',
      'screen and (max-width: 768px)'
    ],
  });

  renderer.renderStatic({
    fontSize: '16px',
  }, 'html');
  renderer.renderStatic({
    fontFamily: '"Segoe UI", "SF Optimized", system-ui, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular", "Roboto", sans-serif',
    fontSize: '14px',
    lineHeight: '1.4',
    cursor: 'default',
    color: '#304558',
    wordBreak: 'break-word',
  }, 'body');
  renderer.renderStatic({
    color: '#71b8be',
    transition: 'color .2s',
    textDecoration: 'none'
  }, 'a:hover');
  renderer.renderStatic({
    color: 'inherit'
  }, 'a');
  renderer.renderStatic({
    fontFamily: '"Segoe UI", "SF Optimized", system-ui, -apple-system, BlinkMacSystemFont, ".SFNSText-Regular", "Roboto", sans-serif'
  }, ' #app button, #app input, #app optgroup, #app select, #app textarea');
  renderer.renderStatic({
    fontSize: '14px',
    wordBreak: 'break-word',
    padding: '6px 14px',
    background: driveTheme.palette.darkHover
  }, '.react-hint__content');
  renderer.renderStatic({
    borderTopColor: driveTheme.palette.darkHover
  }, '.react-hint--top:after');
  renderer.renderStatic({
    borderBottomColor: driveTheme.palette.darkHover
  }, '.react-hint--bottom:after');
  renderer.renderStatic({
    borderLeftColor: driveTheme.palette.darkHover
  }, '.react-hint--left:after');
  renderer.renderStatic({
    borderRightColor: driveTheme.palette.darkHover
  }, '.react-hint--right:after');
  renderer.renderStatic({
    marginRight: '1rem'
  }, '.mr-1');
  renderer.renderStatic({
    marginLeft: '1rem'
  }, '.ml-1');
  renderer.renderStatic({
    marginTop: '1rem'
  }, '.mt-1');
  renderer.renderStatic({
    margin: 'auto'
  }, '.m-auto');
  renderer.renderStatic({
    cursor: 'pointer'
  }, '.curp');
  renderer.renderStatic({
    textDecoration: 'none'
  }, '.tD-none');
  renderer.renderStatic({
    zIndex: 667
  }, '.SingleDatePicker_picker');
  renderer.renderStatic({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }, '.text-truncate');
  renderer.renderStatic({
    display: 'flex'
  }, '.d-flex');

  return { renderer, mountNode };
}
