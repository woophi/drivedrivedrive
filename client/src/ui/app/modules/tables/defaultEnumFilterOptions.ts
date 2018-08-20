import { getBrowser, getOS } from 'ui/shared/scripts/browsersAndOs';
import { EnumFilterModel } from './types';

const enum Browser {
  OTHER = 0,

  IE_LOW = 10,
  IE_8 = 11,
  IE_9 = 12,
  IE_10 = 13,
  IE_11 = 14,
  IE_HI = 15,

  CHROME = 20,
  OPERA = 21,
  FF = 30,
  SAFARI = 40,

  EDGE = 100
}

const enum OS {
  OTHER = 0,
  WINDOWS = 1,
  OSX = 2,
  LINUX = 3,
  ANDROID = 10,
  IOS = 11
}


const SUPPORTED_BROWSERS = [
  Browser.CHROME,
  Browser.EDGE,
  Browser.FF,
  Browser.IE_9,
  Browser.IE_10,
  Browser.IE_11,
  Browser.OPERA,
  Browser.SAFARI,
  Browser.OTHER,
];

const OSES = [
  OS.WINDOWS,
  OS.ANDROID,
  OS.OSX,
  OS.IOS,
  OS.LINUX,
  OS.OTHER
];

// International filter labels
export const browserOptions: EnumFilterModel = SUPPORTED_BROWSERS.map(browser => ({
  label: getBrowser(browser).name,
  value: browser,
}));

export const osOptions: EnumFilterModel = OSES.map(os => ({
  label: getOS(os).name,
  value: os
}));
