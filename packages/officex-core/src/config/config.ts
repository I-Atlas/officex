import { join, sep } from "node:path";

export const localChromePath = join("headless-chromium.zip");
export const setupChromePath = join(sep, "tmp");
export const executablePath = join(setupChromePath, "headless-chromium");

export const DEBUG = !!process.env.DEBUG;
export const WITH_LOCAL_CHROME = !!process.env.LOCAL_CHROME;

export const LOADING_TIMEOUT = 10000;
export const MOBILE_USERAGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A5248v [FBAN/FBIOS;FBDV/iPhone13,3;FBMD/iPhone;FBSN/iOS;FBSV/17.0;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]";

export const MOBILE_DIMENSION = {
  width: 390,
  height: 844,
};
