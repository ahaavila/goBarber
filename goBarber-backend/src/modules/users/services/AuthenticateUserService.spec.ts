import AppError from '@shared/errors/AppError';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import User from '../infra/typeorm/entities/User';

describe('AuthenticateUserService', () => {
  it('should be able to authenticate', async () => {
    // passamos para o service o fake repository
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    // criamos nosso service
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // criamos um novo appointment
    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    // Faço os testes e digo que precisa retornar uma propriedade token e uma user
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(User);
  });
});
