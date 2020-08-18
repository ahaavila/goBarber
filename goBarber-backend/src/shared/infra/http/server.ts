import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
// Rota onde vai conter as minhas imagens, ex: localhost:3333/files/nomeDaImagem
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

// Tratativa dos Erros //
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // Se o meu erro for de um tipo conhecido, eu devolvo pro Front um erro de maneira amigável
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  // Se for um erro que eu não conheço
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
