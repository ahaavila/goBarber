import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

const sessionsRoter = Router();
const sessionsController = new SessionsController();

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta.

sessionsRoter.post('/', sessionsController.create);

export default sessionsRoter;
