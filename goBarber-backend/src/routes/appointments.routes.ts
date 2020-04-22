import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

// Rota: Receber uma requisição, chamar outro arquivo, devolver uma resposta.

appointmentsRouter.get('/', async (request, response) => {
  // seleciono o meu repositorio
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  // busco todos os appointments
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    // Recebo meus dados pelo body.
    const { provider, date } = request.body;

    // Transformo a minha data de string para Date
    const parsedDate = parseISO(date);

    // Chamo meu service de criação de Appointment
    const createAppointment = new CreateAppointmentService();

    // Crio o meu Appointment
    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider,
    });

    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default appointmentsRouter;