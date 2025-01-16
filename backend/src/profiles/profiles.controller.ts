import { Controller, Get, Post, Delete, Body,Query, Put, Param} from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async getAllProfiles(
    @Query('role') role: string,
    @Query('userId') userId: string,
  ) {
    const filters = { role,userId };
    return this.profilesService.getAllProfiles(filters);
  }

  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return await this.profilesService.getProfileById({ id });
  }

  @Post('create')
  async createProfile(@Body() profile: any) {
    return await this.profilesService.createProfile(profile);
  }

  @Delete('delete/:id')
  async deleteProfile(@Param('id') id: any) {
    return await this.profilesService.deleteProfile(id);
  }

  @Put('update/:id')
  async updateProfile(
    @Param('id') id: string, 
    @Body() updatedData: any
  ) {
    return await this.profilesService.updateProfile(id, updatedData);
  }
}
