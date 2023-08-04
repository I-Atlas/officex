import { debug, startParsing, errorParsing, finishParsing } from "./logger";
import { IConverterConfig } from "../types";
import {
  MOBILE_USERAGENT,
  MOBILE_DIMENSION,
  LOADING_TIMEOUT,
  FORMATS,
} from "../config/constants";
import { Browser, PDFOptions } from "puppeteer";
import { Readability } from "@mozilla/readability";
import { sanitize } from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

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
): Promise<Buffer> {
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

  const formatConfig = FORMATS[extension];

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

  switch (extension) {
    case "PDF": {
      const pdfConfig: PDFOptions = {
        ...config,
        format: !mobileViewport ? size : undefined,
        width: mobileViewport ? `${MOBILE_DIMENSION.width}px` : undefined,
        height: mobileViewport ? `${MOBILE_DIMENSION.height}px` : undefined,
        printBackground: true,
        scale: 0.78,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      };
      startParsing(url, extension, pdfConfig);

      result = await page.pdf(pdfConfig);
      break;
    }

    case "TXT": {
      const txtConfig = { ...config };
      startParsing(url, extension, txtConfig);

      const extractedText = await page.$eval("*", (el) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(el);
        selection?.removeAllRanges();
        selection?.addRange(range);
        return window.getSelection()?.toString();
      });

      if (!extractedText) {
        errorParsing(url, extension, txtConfig);
        throw new Error(
          `Encountered error while parsing ${url} to ${extension}`,
        );
      }

      result = Buffer.from(extractedText ?? "", "utf-8");
      break;
    }

    case "PNG": {
      const pngConfig = { ...config, fullPage: true };
      startParsing(url, extension, pngConfig);

      result = await page.screenshot(pngConfig);
    }

    case "JSON": {
      const jsonConfig = { ...config };
      startParsing(url, extension, jsonConfig);

      const html = await page.evaluate(() => {
        return document.querySelector("html")?.outerHTML ?? "";
      });

      const doc = new JSDOM(html, { url: url });
      const reader = new Readability(doc.window.document);
      const article = reader.parse();

      if (!article) {
        errorParsing(url, extension, jsonConfig);
        throw new Error(
          `Encountered error while parsing ${url} to ${extension}`,
        );
      }

      const sanitized = sanitize(JSON.stringify(article));
      result = Buffer.from(sanitized, "utf-8");
      break;
    }

    default: {
      throw new Error(`Unsupported format: ${extension}`);
    }
  }

  await browser.close();
  finishParsing(url, extension);
  return result;
}
