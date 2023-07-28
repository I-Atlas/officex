import { Injectable } from '@nestjs/common';
import {
  convert,
  getBrowser,
  debug,
  IConverterConfig,
  OFFICEX_FORMATS,
} from '@officex/core';

const DEFAULT_CONFIG: IConverterConfig = {
  url: 'https://google.fr',
  outputFile: 'google.pdf',
  size: 'Letter',
  extension: 'PDF',
  mobileViewport: false,
  flushToDisk: false,
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async convertWebpage(config: IConverterConfig = DEFAULT_CONFIG) {
    return await convert(await getBrowser(), config);
  }
}
