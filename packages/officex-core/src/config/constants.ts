import * as path from "node:path";
import type { IFormats } from "../types";

export const LOCAL_CHROME_PATH = path.join("headless-chromium.zip");
export const SETUP_CHROME_PATH = path.join(path.sep, "tmp");
export const EXECUTABLE_PATH = path.join(
  SETUP_CHROME_PATH,
  "headless-chromium",
);

export const DEBUG = !!process.env.DEBUG;
export const WITH_LOCAL_CHROME = !!process.env.LOCAL_CHROME;

export const LOADING_TIMEOUT = 30000;
export const MOBILE_USERAGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21A5248v [FBAN/FBIOS;FBDV/iPhone13,3;FBMD/iPhone;FBSN/iOS;FBSV/17.0;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]";

export const MOBILE_DIMENSION = {
  width: 390,
  height: 844,
};

export const FORMATS: IFormats = {
  PDF: {
    extension: ".pdf",
    mime: "application/pdf",
    type: "PDF",
  },
  PNG: {
    extension: ".png",
    mime: "image/png",
    type: "PNG",
  },
  TXT: {
    extension: ".txt",
    mime: "text/plain",
    type: "TXT",
  },
  JSON: {
    extension: ".json",
    mime: "application/json",
    type: "JSON",
  },
};
