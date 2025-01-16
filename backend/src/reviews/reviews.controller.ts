import { Controller, Get, Post, Delete,Put, Body , Query, Param} from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getForms(
    @Query('formId') formId: string,
    @Query('courseId') courseId: string,
  ) {
 
    const filters = { formId, courseId };
    return this.reviewsService.getAllReviews(filters);
  }

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return await this.reviewsService.getReviewById({ id });
  }

  @Post('create')
  async createReview(@Body() review: any) {
    return await this.reviewsService.createReview(review);
  }
  @Delete('delete')
  async deleteReview(@Body() id: any) {
    return await this.reviewsService.deleteReview(id);
  }
  @Put('update/:id')
  async updateReview(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.reviewsService.updateReview(id, updatedData);
  }
}
