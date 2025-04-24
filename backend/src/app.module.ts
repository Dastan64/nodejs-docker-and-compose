import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './hash/hash.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.testing', '.env.development', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [User, Wish, Offer, Wishlist],
        synchronize: true,
      }),
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    JwtModule,
    HashModule,
  ],
  providers: [AuthService],
})
export class AppModule {}
