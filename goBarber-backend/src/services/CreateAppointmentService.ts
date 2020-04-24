// Services: Contém as minhas regras de negócio.
// O Service nunca vai ter as informações de request e response
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

// SOLID
// S -> Single Responsability Principle -> Cada arquivo da minha aplicação tem uma responsabilidade
// D -> Dependency Invertion Principle ->

class CreateAppointmentService {
  // Método que vai executar o meu service
  // Todo metodo async tem que ser passado como Promise o meu tipo
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    // Verifica se a data está disponível
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    // Se a data não estiver disponível
    if (findAppointmentInSameDate) {
      // Retorna essa mensagem de erro para a minha rota
      throw Error('This appointment is already booked');
    }

    // Crio o appointment
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // salvo o meu appointment
    await appointmentsRepository.save(appointment);

    // Retorna o Appointment para a Rota ou para outro método
    return appointment;
  }
}

export default CreateAppointmentService;
