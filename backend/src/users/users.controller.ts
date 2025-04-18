import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../shared/types/interfaces';

import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { SensitiveDataInterceptor } from '../shared/interceptors/sensitive-data-interceptor';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(SensitiveDataInterceptor)
  @Get('me')
  async getCurrentUser(@Req() req: RequestWithUser) {
    return await this.usersService.findById(req.user.id);
  }

  @UseInterceptors(SensitiveDataInterceptor)
  @Patch('me')
  async editCurrentUser(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @UseInterceptors(SensitiveDataInterceptor)
  @Get('me/wishes')
  async getProfileWishes(@Req() req: RequestWithUser) {
    return await this.usersService.findWishes({ id: req.user.id });
  }

  @UseInterceptors(SensitiveDataInterceptor)
  @Get(':username')
  async getByUsername(@Param('username') username: string): Promise<User> {
    return await this.usersService.findByUsername(username);
  }

  @UseInterceptors(SensitiveDataInterceptor)
  @Get(':username/wishes')
  async getWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    return await this.usersService.findWishes({ username });
  }

  @UseInterceptors(SensitiveDataInterceptor)
  @Post('find')
  async findAll(@Body() { query }: FindUsersDto): Promise<User[]> {
    return await this.usersService.findMany(query);
  }
}
