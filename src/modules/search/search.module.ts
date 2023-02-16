import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [SearchService],
  controllers: [SearchController],
  imports: [AuthModule, UserModule],
})
export class SearchModule {}
