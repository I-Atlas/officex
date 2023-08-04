import {
  createReadStream,
  stat,
  access,
  exists,
  constants,
  chmod,
} from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { Extract } from "unzipper";
import puppeteer, { Browser, PuppeteerLaunchOptions } from "puppeteer";

import {
  LOCAL_CHROME_PATH,
  SETUP_CHROME_PATH,
  EXECUTABLE_PATH,
  DEBUG,
  WITH_LOCAL_CHROME,
} from "./config/constants";
import { debug } from "./services/logger";

const statPromise = promisify(stat);
const accessPromise = promisify(access);
const existsPromise = promisify(exists);
const chmodPromise = promisify(chmod);

export const getBrowser = (() => {
  let browser: Browser;
  return async () => {
    if (
      typeof browser === "undefined" ||
      !(await isBrowserAvailable(browser))
    ) {
      if (WITH_LOCAL_CHROME) {
        await setupLocalChrome();
        debug("Local Chrome setuped");
      }
      const puppeteerConfig: PuppeteerLaunchOptions = {
        args: [
          // error when launch(); No usable sandbox! Update your kernel
          "--no-sandbox",
          // error when launch(); Failed to load libosmesa.so
          // "--disable-gpu",
          // freeze when newPage()
          // "--single-process",
        ],
        dumpio: DEBUG,
        headless: "new",
        pipe: true,
        ...(WITH_LOCAL_CHROME ? { EXECUTABLE_PATH } : null),
      };
      debug("Puppeteer config: ", puppeteerConfig);
      browser = await puppeteer.launch(puppeteerConfig);
      const browserVersion = await browser.version();
      debug(`launch done: ${browserVersion}`);
    }
    return browser;
  };
})();

async function isBrowserAvailable(browser: Browser) {
  try {
    await browser.version();
  } catch (e) {
    debug(e); // not opened etc.
    return false;
  }
  return true;
}

async function setupLocalChrome() {
  const exists = await existsPromise(EXECUTABLE_PATH);
  if (exists) {
    debug("Executable Chrome already exists with path", EXECUTABLE_PATH);
    return;
  }
  debug(
    "Setup local chrome with zipPath and setupPath",
    LOCAL_CHROME_PATH,
    SETUP_CHROME_PATH,
  );
  try {
    const zipPath = resolve(LOCAL_CHROME_PATH);
    const outPath = resolve(SETUP_CHROME_PATH);

    const inStats = await statPromise(zipPath);
    if (!inStats.isFile()) {
      throw new Error(`File ${zipPath} is not a file`);
    }

    const outStats = await statPromise(outPath);
    if (!outStats.isDirectory()) {
      throw new Error(`File ${outPath} is not a valid output directory`);
    }
    await accessPromise(outPath, constants.W_OK);
    await createReadStream(zipPath)
      .pipe(Extract({ path: outPath }))
      .promise();

    await chmodPromise(EXECUTABLE_PATH, 100);
  } catch (err) {
    throw new Error(err);
  }
}
