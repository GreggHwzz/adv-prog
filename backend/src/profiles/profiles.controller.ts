import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async getProfiles() {
    return await this.profilesService.getProfiles();
  }

}
