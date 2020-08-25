import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    // verifico se o user_id pertence a algum usuario no banco
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    // Verifico se já existia um avatar anteriormente nesse usuario //
    if (user.avatar) {
      // Deletar avatar anterior
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // Verifico se já existe esse arquivo
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      // se ele existir eu deleto ele
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    // Fim - Verifico se já existia um avatar anteriormente nesse usuario //

    // Jogo o meu avatar para dentro do campo avatar
    user.avatar = avatarFilename;

    // Atualizo meu user com o avatar
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;