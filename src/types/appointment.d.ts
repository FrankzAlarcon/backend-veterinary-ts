interface Appointment {
  date: Date,
  symptoms: string,
  prescription: string,
  isCompleted: boolean,
  price: number | null,
  veterinarianId: number,
  customerId: number,
  petId: number
}

export type CreateAppointment = Appointment;

export type UpdateAppointment = Partial<Appointment>