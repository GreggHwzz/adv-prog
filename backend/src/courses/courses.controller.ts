import { Controller, Get, Query, Post, Delete, Body, Put, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getCourses(
    @Query('teacherId') teacherId: string
  ) {
 
    const filters = {teacherId};
    return this.coursesService.getAllCourses(filters);
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return await this.coursesService.getCourseById({ id });
  }

  @Post('create')
  async createCourse(@Body() course: any) {
    return await this.coursesService.createCourse(course);
  }

  @Delete('delete/:id')
  async deleteReview(@Param('id') id: any) {
    return await this.coursesService.deleteCourse(id);
  }

  @Put('update/:id')
  async updateCourse(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.coursesService.updateCourse(id, updatedData);
  }
}
