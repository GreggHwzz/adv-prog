import { Controller, Get, Post, Put, Query, Delete, Body, Param } from '@nestjs/common';
import { FormQuestionsService } from './formQuestions.service';

@Controller('form-questions')
export class FormQuestionsController {
  constructor(private readonly formQuestionsService: FormQuestionsService) {}

  @Get()
  async getQuestionForms(
    @Query('questionId') questionId: string,
    @Query('formId') formId: string
  ) {
    const filters = { questionId, formId };
    return this.formQuestionsService.getAllFormQuestions(filters);
  }

  @Post('/create')
  async create(@Body() formQuestion: { formId: string; questionId: string }) {
    return await this.formQuestionsService.createFormQuestion(formQuestion);
  }

  @Delete('delete/:formId/:questionId')
  async delete(@Param() params: { formId: string; questionId: string }) {
    return await this.formQuestionsService.deleteFormQuestion(params.formId, params.questionId);
  }

  @Put('update/:formId/:questionId')
  async update(
    @Param() params: { formId: string; questionId: string },
    @Body() updatedData: any
  ) {
    return await this.formQuestionsService.updateFormQuestion(
      params.formId,
      params.questionId,
      updatedData
    );
  }
}
