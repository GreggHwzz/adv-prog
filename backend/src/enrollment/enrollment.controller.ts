import { Controller, Get, Post, Put, Query, Delete, Body, Param } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly formQuestionsService: EnrollmentService) {}

  @Get()
  async getQuestionForms(
    @Query('studentId') studentId: string,
    @Query('courseId') courseId: string
  ) {
    const filters = { studentId, courseId };
    return this.formQuestionsService.getAllEnrollments(filters);
  }


  @Put('update/:formId/:questionId')
  async update(
    @Param() params: { formId: string; questionId: string },
    @Body() updatedData: any
  ) {
    return await this.formQuestionsService.updateEnrollment(
      params.formId,
      params.questionId,
      updatedData
    );
  }
}
