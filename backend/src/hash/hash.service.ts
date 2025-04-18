import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './constants';

@Injectable()
export class HashService {
  async hash(data: string) {
    try {
      return bcrypt.hash(data, SALT_ROUNDS);
    } catch {
      throw new InternalServerErrorException('Ошибка при хешировании пароля');
    }
  }

  async compare(data: string, hash: string) {
    try {
      return await bcrypt.compare(data, hash);
    } catch {
      throw new InternalServerErrorException('Ошибка при проверке пароля');
    }
  }
}
