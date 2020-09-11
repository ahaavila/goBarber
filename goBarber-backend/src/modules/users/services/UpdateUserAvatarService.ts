import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    // verifico se o user_id pertence a algum usuario no banco
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    // Verifico se já existia um avatar anteriormente nesse usuario //
    if (user.avatar) {
      // Deleto o avatar anterior
      await this.storageProvider.deleteFile(user.avatar);
    }
    // Salvo o novo avatar
    const filename = await this.storageProvider.saveFile(avatarFilename);
    // Fim - Verifico se já existia um avatar anteriormente nesse usuario //

    // Jogo o meu avatar para dentro do campo avatar
    user.avatar = filename;

    // Atualizo meu user com o avatar
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
