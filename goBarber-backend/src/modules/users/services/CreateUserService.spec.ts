import AppError from '@shared/errors/AppError';

import CreateUserService from './CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUserService', () => {
  it('should be able to create a new user', async () => {
    // passamos para o service o fake repository
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    // criamos nosso service
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    // criamos um novo appointment
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // Faço os testes
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    // passamos para o service o fake repository
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    // criamos nosso service
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    // criamos um novo appointment
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // Faço os testes
    expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
