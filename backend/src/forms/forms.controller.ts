import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
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

  @Delete('delete')
  async deleteReview(@Body() id: any) {
    return await this.formsService.deleteForm(id);
  }
}
