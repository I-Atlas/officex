import { PaperFormat } from "puppeteer";

export interface IConverterConfig {
  extension: PDFXFormatKeys;
  flushToDisk: boolean;
  mobileViewport: boolean;
  outputFile: string;
  size: PDFXSizes;
  url: string;
}

export type PDFXSizes = PaperFormat;

export type PDFXFormatKeys = "PDF" | "PNG";

export type IPDFXFormats = { [K in PDFXFormatKeys]: IPDFXFormat };

export interface IPDFXFormat {
  extension: string;
  mime: string;
  type: PDFXFormatKeys;
}

export const PDFX_FORMATS: IPDFXFormats = {
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
};
