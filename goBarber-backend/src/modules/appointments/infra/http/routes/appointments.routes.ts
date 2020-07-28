import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta.

// Middleware de autenticação
appointmentsRouter.use(ensureAuthenticated);

// Rotas appointments
// appointmentsRouter.get('/', async (request, response) => {
//   // busco todos os appointments
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
  // Recebo meus dados pelo body.
  const { provider_id, date } = request.body;

  // Transformo a minha data de string para Date
  const parsedDate = parseISO(date);

  // instancio o meu repositorio de appointments
  const appointmentsRepository = new AppointmentsRepository();

  // Chamo meu service de criação de Appointment
  const createAppointment = new CreateAppointmentService(
    appointmentsRepository,
  );

  // Crio o meu Appointment
  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
