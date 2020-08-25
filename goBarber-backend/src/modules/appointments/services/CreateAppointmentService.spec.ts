import AppError from '@shared/errors/AppError';
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

  it('should not be able to create two appointments on the same time', async () => {
    // passamos para o service o fake repository
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    // criamos nosso service
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    // crio uma variavel que contem a data de agora
    const appointmentDate = new Date(2020, 4, 10, 11);

    // criamos um novo appointment
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
    });

    // Quero que ao executar o cadastro do appointment novamnete ele dê um erro
    // e que esse erro seja uma instancia de AppError.
    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
