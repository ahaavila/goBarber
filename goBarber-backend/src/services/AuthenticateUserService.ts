import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    // Validando email digitado //
    const userRepository = getRepository(User);

    // Busco no banco se realmente existe um email igual ao digitado
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }
    // Fim - Validando email digitado //
    // user.password -> Senha criptografada
    // password -> Senha não criptografada

    // Validando Senha digitada //
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }
    // Fim - Validando Senha digitada //

    // Usuario autenticado //
    // Gero o token com JWT
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    // retorno os dados para a rota
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
