import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [LocationController],
  imports: [UserModule],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
