import { PaperFormat } from "puppeteer";

export interface IConverterConfig {
  extension: OFFICEXFormatKeys;
  flushToDisk: boolean;
  mobileViewport: boolean;
  outputFile: string;
  size: OFFICEXSizes;
  url: string;
}

export type OFFICEXSizes = PaperFormat;

export type OFFICEXFormatKeys = "PDF" | "PNG" | "TXT";

export type IOFFICEXFormats = { [K in OFFICEXFormatKeys]: IOFFICEXFormat };

export interface IOFFICEXFormat {
  extension: string;
  mime: string;
  type: OFFICEXFormatKeys;
}

export const OFFICEX_FORMATS: IOFFICEXFormats = {
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
};
