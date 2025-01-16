import { Controller, Get, Query, Post, Delete, Body, Put, Param } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async getAllStudents() {
    return await this.studentsService.getAllStudents();
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return await this.studentsService.getStudentById({ id });
  }

  @Post('create')
  async createStudent(@Body() student: any) {
    return await this.studentsService.createStudent(student);
  }

  @Delete('delete/:id')
  async deleteReview(@Param('id') id: any) {
    return await this.studentsService.deleteStudent(id);
  }

  @Put('update/:id')
  async updateStudent(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.studentsService.updateStudent(id, updatedData);
  }
}
