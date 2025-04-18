import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

import { LocalGuard } from './guards/local.guard';

import { RequestWithUser } from '../shared/types/interfaces';
import { SensitiveDataInterceptor } from '../shared/interceptors/sensitive-data-interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req: RequestWithUser) {
    return this.authService.auth(req.user);
  }

  @UseInterceptors(SensitiveDataInterceptor)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch {
      throw new InternalServerErrorException('Не удалось создать пользователя');
    }
  }
}
