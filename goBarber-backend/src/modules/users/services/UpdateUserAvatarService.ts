import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import User from '../infra/typeorm/entities/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    // verifico se o user_id pertence a algum usuario no banco
    const user = await userRepository.findOne(user_id);

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
    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
