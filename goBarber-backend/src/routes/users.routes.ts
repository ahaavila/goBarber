import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta.

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    // instancio meu service
    const createUser = new CreateUserService();

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
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
