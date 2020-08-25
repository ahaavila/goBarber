import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../../infra/typeorm/entities/User';

// extendes o Repository para pegar os metodos create, find... e passo como parametro também o model que vai ser usado
class UsersRepository implements IUsersRepository {
  // Variavel que vai armazenar esse repositorio
  private users: User[] = [];

  // Função que encontra um user pelo ID
  public async findById(id: string): Promise<User | undefined> {
    // procuro o user no meu array
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  // Função que encontra um user pelo email
  public async findByEmail(email: string): Promise<User | undefined> {
    // procuro o email no meu array
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  // Função que cria um Appointment
  // Essa função recebe o provider_id e a date e retorna um appointment
  public async create(userData: ICreateUserDTO): Promise<User> {
    // crio um novo user
    const user = new User();

    // jogo ele dentro do array
    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  // Função que vai salvar o usuario no BD
  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default UsersRepository;
