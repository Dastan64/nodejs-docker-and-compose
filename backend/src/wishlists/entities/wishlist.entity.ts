import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { IsOptional, IsUrl, Length } from 'class-validator';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../shared/base.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @Column()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true, length: 1500 })
  @IsOptional()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
