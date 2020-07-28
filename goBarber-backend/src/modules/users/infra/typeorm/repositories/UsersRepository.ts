// Repository é como eu vou trabalhar com os dados do model: lista, deletar, criar...
import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

// extendes o Repository para pegar os metodos create, find... e passo como parametro também o model que vai ser usado
class UsersRepository implements IUsersRepository {
  // Crio uma variavel do tipo Repository de appointment
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  // Função que encontra um user pelo ID
  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  // Função que encontra um user pelo email
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  // Função que cria um Appointment
  // Essa função recebe o provider_id e a date e retorna um appointment
  public async create(userData: ICreateUserDTO): Promise<User> {
    // Primeiro vamos criar um user
    const user = this.ormRepository.create(userData);

    // Segundo vamos salvar o user no banco
    await this.ormRepository.save(user);

    return user;
  }

  // Função que vai salvar o usuario no BD
  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
