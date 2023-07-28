import { debug } from "./logger";
import { IConverterConfig, OFFICEX_FORMATS } from "../models/officex.model";
import {
  MOBILE_USERAGENT,
  MOBILE_DIMENSION,
  LOADING_TIMEOUT,
} from "../config/config";
import { Browser, PDFOptions } from "puppeteer";
import { Readability } from "@mozilla/readability";
import { sanitize } from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

function readable(document: Document) {
  const reader = new Readability(document);
  const article = reader.parse();
  return article;
}

export async function convert(
  browser: Browser,
  {
    url,
    outputFile,
    size,
    flushToDisk,
    extension,
    mobileViewport,
  }: IConverterConfig,
) {
  debug("Attempt to get browser");

  const page = await browser.newPage();
  await page.emulateMediaType("screen");
  await page.setJavaScriptEnabled(false);
  const response = await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: LOADING_TIMEOUT,
  });
  page.on("dialog", async (dialog) => {
    await dialog.dismiss();
  });

  if (!response) {
    debug("[ERROR] response does not exist");
    throw new Error("Response does not exist");
  }
  debug(`Page gone to ${url} with status ${response.status()}`);

  const formatConfig = OFFICEX_FORMATS[extension];

  const config = {
    path: flushToDisk ? `${outputFile}${formatConfig.extension}` : undefined,
  };

  if (mobileViewport) {
    debug("Simulate a mobile viewport");
    page.setUserAgent(MOBILE_USERAGENT);

    await page.setViewport({
      width: MOBILE_DIMENSION.width,
      height: MOBILE_DIMENSION.height,
      isMobile: mobileViewport,
    });
  }

  let result: Buffer;
  if (extension === "PDF") {
    const pdfConfig: PDFOptions = {
      ...config,
      format: !mobileViewport ? size : undefined,
      width: mobileViewport ? `${MOBILE_DIMENSION.width}px` : undefined,
      height: mobileViewport ? `${MOBILE_DIMENSION.height}px` : undefined,
      printBackground: true,
      scale: 0.78,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    };
    debug("Start PDF conversion with config", pdfConfig);

    result = await page.pdf(pdfConfig);
  } else if (extension === "PNG") {
    const pngConfig = { ...config, fullPage: true };
    debug("Start PNG conversion with config", pngConfig);

    result = await page.screenshot(pngConfig);
  } else if (extension === "TXT") {
    debug("Start TXT conversion with config");
    const dom = new JSDOM(``, {
      url: url,
      referrer: url,
      contentType: "text/html",
      includeNodeLocations: true,
      storageQuota: 10000000,
    });
    const parsed = readable(dom.window.document);
    if (!parsed) {
      throw new Error(`Document not parsed ${extension}`);
    }
    const markup = sanitize(parsed.content);
    const buff = Buffer.from(markup, "utf-8");
    result = buff;
  } else {
    throw new Error(`Unsupported format ${extension}`);
  }

  await browser.close();
  debug("Conversion done !");
  return result;
}