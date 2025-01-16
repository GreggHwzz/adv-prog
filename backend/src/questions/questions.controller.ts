import { Controller, Get, Post, Delete, Body,Query, Put, Param} from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async getAllQuestions() {
    return await this.questionsService.getAllQuestions();
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return await this.questionsService.getQuestionById({ id });
  }

  @Post('create')
  async createQuestion(@Body() question: any) {
    return await this.questionsService.createQuestion(question);
  }

  @Delete('delete')
  async deleteQuestion(@Body() id: any) {
    return await this.questionsService.deleteQuestion(id);
  }

  @Put('update/:id')
  async updateQuestion(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.questionsService.updateQuestion(id, updatedData);
  }
}
