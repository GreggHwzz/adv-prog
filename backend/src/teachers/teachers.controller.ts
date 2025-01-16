import { Controller, Get, Query, Post, Delete, Body, Put, Param } from '@nestjs/common';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async getAllTeachers() {
    return await this.teachersService.getAllTeachers();
  }

  @Get(':id')
  async getTeacherById(@Param('id') id: string) {
    return await this.teachersService.getTeacherById({ id });
  }

  @Post('create')
  async createTeacher(@Body() teacher: any) {
    return await this.teachersService.createTeacher(teacher);
  }

  @Delete('delete')
  async deleteReview(@Body() id: any) {
    return await this.teachersService.deleteTeacher(id);
  }

  @Put('update/:id')
  async updateTeacher(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.teachersService.updateTeacher(id, updatedData);
  }
}
