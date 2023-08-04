import { PaperFormat } from "puppeteer";

export interface IConverterConfig {
  extension: Extensions;
  flushToDisk: boolean;
  mobileViewport: boolean;
  outputFile: string;
  size: Sizes;
  url: string;
}

export type Sizes = PaperFormat;

export type Extensions = "PDF" | "PNG" | "TXT" | "JSON";

export type IFormats = { [K in Extensions]: IFormat };

export interface IFormat {
  extension: string;
  mime: string;
  type: Extensions;
}
