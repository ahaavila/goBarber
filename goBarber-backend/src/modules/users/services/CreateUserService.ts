import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    // Crio o meu repository usando o typeorm
    const usersRepository = getRepository(User);

    // verifico se já existe um usuario com o email digitado
    const checkUserExits = await usersRepository.findOne({
      where: { email },
    });

    // Se existir, retorno um erro
    if (checkUserExits) {
      throw new AppError('Email address already used.');
    }

    // Crio a hash do password
    const hashedPassword = await hash(password, 8);

    // Se não, crio a instancia para salvar no banco
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Salvo no banco
    await usersRepository.save(user);

    // Retorno o user
    return user;
  }
}

export default CreateUserService;
