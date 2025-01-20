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

  @Post('enroll')
  async enrollStudent(@Body() body: { studentId: string, courseId: string }) {
    const { studentId, courseId } = body;

    try {
      const enrollment = await this.formQuestionsService.enrollStudentToCourse(studentId, courseId);
      return { message: 'Inscription réussie', data: enrollment };
    } catch (error) {
      return { message: 'Échec de l\'inscription', error: error.message };
    }
  }
}
