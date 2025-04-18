import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishesService } from '../wishes/wishes.service';

import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const items = await this.wishesService.findAll({
      id: In(createWishlistDto.itemsId),
    });

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items,
    });

    const savedWishlist = await this.wishlistsRepository.save(wishlist);

    return this.findOne({
      where: { id: savedWishlist.id },
      relations: ['owner', 'items'],
    });
  }

  async findById(id: number): Promise<Wishlist> {
    return await this.findOne({ where: { id }, relations: ['owner', 'items'] });
  }

  async findOne(options: FindOneOptions<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne(options);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
      order: { id: 'ASC' },
    });
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne({ where: { id } });

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужой вишлист');
    }

    await this.wishlistsRepository.update(id, updateWishlistDto);

    return wishlist;
  }

  async removeOne(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете удалить чужой вишлист');
    }

    await this.wishlistsRepository.remove(wishlist);

    return wishlist;
  }
}
