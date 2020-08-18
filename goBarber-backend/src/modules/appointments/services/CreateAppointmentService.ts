// Services: Contém as minhas regras de negócio.
// O Service nunca vai ter as informações de request e response
import { startOfHour } from 'date-fns';
import { container, inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/iAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

// SOLID
// S -> Single Responsability Principle -> Cada arquivo da minha aplicação tem uma responsabilidade
// D -> Dependency Invertion Principle ->

// Falo que essa classe pode receber injeções de dependencias
@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  // Método que vai executar o meu service
  // Todo metodo async tem que ser passado como Promise o meu tipo
  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    // Verifica se a data está disponível
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    // Se a data não estiver disponível
    if (findAppointmentInSameDate) {
      // Retorna essa mensagem de erro para a minha rota
      throw new AppError('This appointment is already booked');
    }

    // Crio o appointment
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // Retorna o Appointment para a Rota ou para outro método
    return appointment;
  }
}

export default CreateAppointmentService;
