import { CSSProperties } from 'react';
import { createRenderer } from 'fela';
import embedded from 'fela-plugin-embedded';
import webPreset from 'fela-preset-web';
import { driveTheme } from 'ui/shared/driveUI';

export function configureFela(mountNodeId: string) {
  const mountNode = document.getElementById(mountNodeId);

  const renderer = createRenderer({
    selectorPrefix: 'f_',
    plugins: [...webPreset, embedded()],
    mediaQueryOrder: [
      'screen and (max-width: 1440px)',
      'screen and (max-width: 768px)'
    ],
  });

  // Our global styles
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
    wordBreak: 'break-word'
  }, '.tippy-tooltip-content');
  renderer.renderStatic({
    background: driveTheme.palette.darkHover
  }, '.tippy-tooltip');
  renderer.renderStatic({
    borderTopColor: driveTheme.palette.darkHover
  }, '.tippy-popper[x-placement^=top] [x-arrow]');
  renderer.renderStatic({
    borderRightColor: driveTheme.palette.darkHover
  }, '.tippy-popper[x-placement^=right] [x-arrow]');
  renderer.renderStatic({
    borderLeftColor: driveTheme.palette.darkHover
  }, '.tippy-popper[x-placement^=left] [x-arrow]');
  renderer.renderStatic({
    borderBottomColor: driveTheme.palette.darkHover
  }, '.tippy-popper[x-placement^=bottom] [x-arrow]');
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
    flex: 1
  }, '.flex-1');
  renderer.renderStatic({
    flex: 2
  }, '.flex-2');
  renderer.renderStatic({
    cursor: 'pointer'
  }, '.curp');
  renderer.renderStatic({
    cursor: 'text'
  }, '.curt');
  renderer.renderStatic({
    pointerEvents: 'none'
  }, '.disabledLink');
  renderer.renderStatic({
    overflow: 'hidden'
  }, '.ovh');

  return { renderer, mountNode };
}
