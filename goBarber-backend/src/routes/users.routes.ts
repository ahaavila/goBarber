import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

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

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUserAvatar = new UpdateUserAvatarService();

      const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

export default usersRouter;
