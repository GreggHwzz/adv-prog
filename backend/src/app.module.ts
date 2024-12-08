import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, FormsModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}