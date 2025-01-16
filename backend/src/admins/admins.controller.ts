import { Controller, Get, Query, Post, Delete, Body, Put, Param } from '@nestjs/common';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async getAllAdmins() {
    return await this.adminsService.getAllAdmins();
  }

  @Get(':id')
  async getAdminById(@Param('id') id: string) {
    return await this.adminsService.getAdminById({ id });
  }

  @Post('create')
  async createAdmin(@Body() admin: any) {
    return await this.adminsService.createAdmin(admin);
  }

  @Delete('delete')
  async deleteReview(@Body() id: any) {
    return await this.adminsService.deleteAdmin(id);
  }

  @Put('update/:id')
  async updateAdmin(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.adminsService.updateAdmin(id, updatedData);
  }
}
