import { Controller, Get, Query, Post, Delete, Body, Put, Param } from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  async getForms(
    @Query('adminId') adminId: string,
    @Query('courseId') courseId: string
  ) {
 
    const filters = { adminId, courseId };
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

  @Delete('delete/:id')
  async deleteReview(@Param('id') id: any) {
    return await this.formsService.deleteForm(id);
  }

  @Put('update/:id')
  async updateForm(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.formsService.updateForm(id, updatedData);
  }

  @Get('responses/:studentId/:formId')
  async getStudentFormResponse(
    @Param('studentId') studentId: string,
    @Param('formId') formId: string
  ) {
    return this.formsService.getStudentFormResponse(studentId, formId);
  }

  @Get('student/:studentId')
  async getFormsForStudent(@Param('studentId') studentId: string) {
    return await this.formsService.getFormsForStudent(studentId);
  }

  @Post('submit-response/:studentId/:formId')
  async submitResponse(
    @Param('studentId') studentId: string,
    @Param('formId') formId: string,
    @Body() body: { feedback: string, isCompleted: boolean }
  ) {
    const { feedback, isCompleted } = body;

    // Appeler le service pour enregistrer la réponse
    return await this.formsService.submitStudentFormResponse(studentId, formId, feedback, isCompleted);
  }
}
