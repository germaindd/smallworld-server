import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/strategies/access-token-strategy';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/:query')
  async search(@Param('query') query: string) {
    return await this.searchService.search(query);
  }
}
