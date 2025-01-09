import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async getQuestions() {
    return await this.questionsService.getQuestions();
  }

  @Post('create')
  async createQuestion(@Body() question: any) {
    return await this.questionsService.createQuestion(question);
  }

  @Delete('delete')
  async deleteReview(@Body() id: any) {
    return await this.questionsService.deleteQuestion(id);
  }
}
