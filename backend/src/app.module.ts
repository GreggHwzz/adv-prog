import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';
import { ConfigModule } from '@nestjs/config';
import { QuestionsModule } from './questions/questions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { AdminsModule } from './admins/admins.module';
import { FormQuestionsModule } from './formQuestions/formQuestions.module';

@Module({
  imports: [
    AuthModule,
    FormsModule,
    QuestionsModule,
    ReviewsModule,
    ProfilesModule,
    CoursesModule,
    StudentsModule,
    TeachersModule,
    AdminsModule,
    FormQuestionsModule,
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}