import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRoter = Router();

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta.

sessionsRoter.post('/', async (request, response) => {
  // Pego os dados digitados
  const { email, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  // Retorno meu user criado
  return response.json({ user, token });
});

export default sessionsRoter;
