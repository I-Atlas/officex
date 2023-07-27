import { debug } from "./logger";
import { IConverterConfig, PDFX_FORMATS } from "../models/pdfx.model";
import {
  MOBILE_USERAGENT,
  MOBILE_DIMENSION,
  LOADING_TIMEOUT,
} from "../config/config";
import { Browser, PDFOptions } from "puppeteer";

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

  const formatConfig = PDFX_FORMATS[extension];

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
  } else {
    throw new Error(`Unsupported format ${extension}`);
  }

  await browser.close();
  debug("Conversion done !");
  return result;
}
