import { Controller, Get, Query, Post, Delete, Body, Put, Param } from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  async getForms(
    @Query('adminId') adminId: string,
    @Query('courseId') courseId: string,
    @Query('studentId') studentId: string
  ) {
 
    const filters = { adminId, courseId, studentId };
    return this.formsService.getAllForms(filters);
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return await this.formsService.getFormById({ id });
  }

  @Post('create')
  async createForm(@Body() form: any) {
    return await this.formsService.createForm(form);
  }

  @Delete('delete')
  async deleteReview(@Body() id: any) {
    return await this.formsService.deleteForm(id);
  }

  @Put('update/:id')
  async updateForm(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.formsService.updateForm(id, updatedData);
  }
}
