import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Wish } from './entities/wish.entity';
import { RequestWithUser } from '../shared/types/interfaces';
import { SensitiveDataInterceptor } from '../shared/interceptors/sensitive-data-interceptor';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
@UseInterceptors(SensitiveDataInterceptor)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post('/')
  async create(
    @Req() req: RequestWithUser,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(createWishDto, req.user);
  }

  @Get('/last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }

  @Get('/top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.findWishById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWishById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.updateWishWithChecks(
      id,
      updateWishDto,
      req.user,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWishById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wish> {
    return await this.wishesService.removeWishWithChecks(id, req.user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWishById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wish> {
    return await this.wishesService.copyWish(id, req.user);
  }
}
