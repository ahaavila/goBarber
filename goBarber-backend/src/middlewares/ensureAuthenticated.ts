import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validação do token JWT //
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT Token is missing');
  }
  // Fim - Validação do token JWT //

  // Verifico se o token é autentico //
  // Separo o token do Bearer
  const [, token] = authHeader.split(' ');

  try {
    // verifico se o token é valido
    const decoded = verify(token, authConfig.jwt.secret);

    // Pego o sub (id) do meu token
    const { sub } = decoded as TokenPayload;

    // Falo que o meu request.user é o id do meu usuario
    request.user = {
      id: sub,
    };

    // Se for valido, eu saio do middleware
    return next();
  } catch {
    // Se não for válido, eu informo o erro
    throw new Error('Invalid JWT token');
  }
  // Fim - Verifico se o token é autentico //
}
