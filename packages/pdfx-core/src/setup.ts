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
  localChromePath,
  setupChromePath,
  executablePath,
  DEBUG,
  WITH_LOCAL_CHROME,
} from "./config/config";
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
        headless: true,
        args: [
          // error when launch(); No usable sandbox! Update your kernel
          "--no-sandbox",
          // error when launch(); Failed to load libosmesa.so
          // "--disable-gpu",
          // freeze when newPage()
          // "--single-process",
        ],
        dumpio: DEBUG,
        pipe: true,
        ...(WITH_LOCAL_CHROME ? { executablePath } : null),
      };
      debug(puppeteerConfig);
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
  const exists = await existsPromise(executablePath);
  if (exists) {
    debug("Executable Chrome already exists with path", executablePath);
    return;
  }
  debug(
    "Setup local chrome with zipPath and setupPath",
    localChromePath,
    setupChromePath,
  );
  try {
    const zipPath = resolve(localChromePath);
    const outPath = resolve(setupChromePath);

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

    await chmodPromise(executablePath, 100);
  } catch (err) {
    throw new Error(err);
  }
}
