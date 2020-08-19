import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointmentService', () => {
  it('should be able to create a new appointment', async () => {
    // passamos para o service o fake repository
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    // criamos nosso service
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    // criamos um novo appointment
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    // Faço os testes
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  // it('should not be able to create two appointments on the same time', () => {
  //   expect;
  // });
});
