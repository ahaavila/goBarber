import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta.

usersRouter.post('/', async (request, response) => {
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
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
