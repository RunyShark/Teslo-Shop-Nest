import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { SeedService } from './seed.service';

@Controller('seed')
// @Auth()
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed() {
    return this.seedService.runSeed();
  }
}
