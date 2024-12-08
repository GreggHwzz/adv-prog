import { Controller, Get, Post, Body } from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  async getForms() {
    return await this.formsService.getForms();
  }

  @Post('create')
  async createForm(@Body() form: any) {
    return await this.formsService.createForm(form);
  }
}
