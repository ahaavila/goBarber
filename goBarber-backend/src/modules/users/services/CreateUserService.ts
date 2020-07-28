import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    // verifico se já existe um usuario com o email digitado
    const checkUserExits = await this.usersRepository.findByEmail(email);

    // Se existir, retorno um erro
    if (checkUserExits) {
      throw new AppError('Email address already used.');
    }

    // Crio a hash do password
    const hashedPassword = await hash(password, 8);

    // Se não, crio a instancia para salvar no banco
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Retorno o user
    return user;
  }
}

export default CreateUserService;
