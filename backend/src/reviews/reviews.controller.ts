import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews() {
    return await this.reviewsService.getReviews();
  }

  @Post('create')
  async createReview(@Body() review: any) {
    return await this.reviewsService.createReview(review);
  }
  @Delete('delete')
  async deleteReview(@Body() id: any) {
    return await this.reviewsService.deleteReview(id);
  }
}
