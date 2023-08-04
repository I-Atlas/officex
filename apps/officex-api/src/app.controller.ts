import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IConverterConfig } from '@officex/core';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/v1/ai/convert-document')
  @ApiResponse({
    status: 201,
    description: 'Webpage converted successfully',
    type: Buffer,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async convertWebpage(@Body() config: IConverterConfig): Promise<Buffer> {
    return await this.appService.convertWebpage(config);
  }
}
