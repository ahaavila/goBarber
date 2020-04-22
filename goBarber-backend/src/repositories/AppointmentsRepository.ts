// Repository é como eu vou trabalhar com os dados do model: lista, deletar, criar...
import { isEqual } from 'date-fns';
import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../models/Appointment';

// coloco o EntityRepository e passo como paramentro o Model dele
@EntityRepository(Appointment)
// extendes o Repository para pegar os metodos create, find... e passo como parametro também o model que vai ser usado
class AppointmentsRepository extends Repository<Appointment> {
  // Toda função async tem que ser passado o tipo como uma Promise
  public async findByDate(date: Date): Promise<Appointment | null> {
    // Procuro no banco um appointment com a mesma data
    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
