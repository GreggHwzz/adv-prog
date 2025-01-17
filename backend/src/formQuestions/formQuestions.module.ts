import { Module } from '@nestjs/common';
import { FormQuestionsController } from './formQuestions.controller';
import { FormQuestionsService } from './formQuestions.service';

@Module({
  controllers: [FormQuestionsController], 
  providers: [FormQuestionsService],      
  exports: [FormQuestionsService],        
})
export class FormQuestionsModule {}
