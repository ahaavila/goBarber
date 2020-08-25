import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    // verifico se já existe um usuario com o email digitado
    const checkUserExits = await this.usersRepository.findByEmail(email);

    // Se existir, retorno um erro
    if (checkUserExits) {
      throw new AppError('Email address already used.');
    }

    // Crio a hash do password
    const hashedPassword = await this.hashProvider.generateHash(password);

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
