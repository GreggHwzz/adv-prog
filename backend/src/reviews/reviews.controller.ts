import { Controller, Get, Post, Delete, Put, Body, Query, Param, BadRequestException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews(
    @Query('formId') formId?: string,
  ) {
    if (!formId) {
      throw new BadRequestException('formId is required to fetch reviews.');
    }

    const filters = { formId };
    return this.reviewsService.getAllReviews(filters);
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Review ID is required.');
    }

    return await this.reviewsService.getReviewById({ id });
  }

  @Post('create')
  async createReview(@Body() review: any) {
    if (!review || !review.formId || !review.questionId || !review.studentId) {
      throw new BadRequestException('Invalid review data. formId, questionId, and studentId are required.');
    }

    return await this.reviewsService.createReview(review);
  }

  @Delete('delete/:id')
  async deleteReview(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Review ID is required for deletion.');
    }

    return await this.reviewsService.deleteReview(id);
  }

  @Put('update/:id')
  async updateReview(
    @Param('id') id: string,
    @Body() updatedData: any,
  ) {
    if (!id) {
      throw new BadRequestException('Review ID is required for updating.');
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new BadRequestException('Updated data cannot be empty.');
    }

    return await this.reviewsService.updateReview(id, updatedData);
  }
}