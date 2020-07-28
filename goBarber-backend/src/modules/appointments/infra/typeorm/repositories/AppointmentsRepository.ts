// Repository é como eu vou trabalhar com os dados do model: lista, deletar, criar...
import { getRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../entities/Appointment';

// extendes o Repository para pegar os metodos create, find... e passo como parametro também o model que vai ser usado
class AppointmentsRepository implements IAppointmentsRepository {
  // Crio uma variavel do tipo Repository de appointment
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  // Função que procura um appointment pela data informada.
  // Toda função async tem que ser passado o tipo como uma Promise
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    // Procuro no banco um appointment com a mesma data
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  // Função que cria um Appointment
  // Essa função recebe o provider_id e a date e retorna um appointment
  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    // Primeiro vamos criar um appointment
    const appointment = this.ormRepository.create({ provider_id, date });

    // Segundo vamos salvar o appointment no banco
    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
