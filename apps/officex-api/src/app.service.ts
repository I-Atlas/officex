import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { convert, getBrowser, IConverterConfig } from '@officex/core';

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
  async convertWebpage(config: IConverterConfig = DEFAULT_CONFIG) {
    try {
      return await convert(await getBrowser(), config);
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.I_AM_A_TEAPOT);
    }
  }
}
