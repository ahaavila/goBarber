import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    // Recebo meus dados pelo body.
    const { provider_id, date } = request.body;

    // Transformo a minha data de string para Date
    const parsedDate = parseISO(date);

    // Chamo meu service de criação de Appointment
    const createAppointment = container.resolve(CreateAppointmentService);

    // Crio o meu Appointment
    const appointment = await createAppointment.execute({
      provider_id,
      date: parsedDate,
    });

    return response.json(appointment);
  }
}
