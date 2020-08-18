import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    // instancio meu service
    const createUser = container.resolve(CreateUserService);

    // Rodo a criação de usuario
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    // deleto o password pra nao aparecer no retorno, mas continua no banco
    delete user.password;

    // Retorno meu user criado
    return response.json(user);
  }
}
