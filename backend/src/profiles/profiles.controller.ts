import { Controller, Get, Param,Post, Body } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('Profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':id')
  async getProfiles(@Param('id') id: string) {
    return await this.profilesService.getProfiles(id);
  }

}
