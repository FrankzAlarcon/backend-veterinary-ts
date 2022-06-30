import { Appointment, PrismaClient } from "@prisma/client";
import { CreateAppointment, UpdateAppointment } from "../types/appointment";
import boom from '@hapi/boom';

const prisma = new PrismaClient();

class AppointmentService {

  async getAll(): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany();
    return appointments;
  }

  async getOne(id: number): Promise<Appointment> {
    const appointment = await prisma.appointment.findUnique({where: {id}});
    if(!appointment) {
      throw boom.notFound('Appointment not found');
    }
    return appointment;
  }

  async create(body: CreateAppointment):Promise<Appointment> {
    const {customerId, veterinarianId, petId} = body;
    const [veterinarianResult, customerResult, petResult] = await Promise.allSettled([
      prisma.veterinarian.findUnique({where: { id: veterinarianId }}),
      prisma.customer.findUnique({where: { id: customerId }, include: { pets: true }}),
      prisma.pet.findUnique({where: { id: petId }})
    ])
    if(veterinarianResult.status === 'rejected' || customerResult.status === 'rejected' || petResult.status === 'rejected') {
      throw boom.notFound('Veterinarian or customer or pet do not exist')
    }
    if(!customerResult.value?.pets.some(pet => pet.id === petId)) {
      throw boom.badRequest(`Customer ${customerId} is not owner of pet ${petId}`);
    }

    const appointment = await prisma.appointment.create({ data: body });
    return appointment;
  }

  async update(id: number, changes: UpdateAppointment): Promise<Appointment> {
    const appointment = await prisma.appointment.findUnique({where: { id }});
    if(!appointment) {
      throw boom.notFound('Appointment not found');
    }
    const {customerId, petId, veterinarianId} = changes;
    if(veterinarianId) {
      const veterinarian = await prisma.veterinarian.findUnique({where: {id: veterinarianId}});
      if(!veterinarian) {
        throw boom.notFound('Veterinarian not founf');
      }      
    }
    if(customerId && petId) {
      const [customer, pet] = await Promise.allSettled([
        prisma.customer.findUnique({where: {id: customerId}, include: {pets: true}}),
        prisma.pet.findUnique({where: {id: petId}})
      ]);
      if(customer.status === 'rejected' || pet.status === 'rejected') {     
        throw boom.notFound('Customer or pet do not exist');
      }
      if(pet.value?.customerId === customerId) {
        throw boom.badRequest(`Customer ${customerId} is not owner of Pet ${petId}`);
      }
    } else {
      if(customerId) {
        const customer = await prisma.customer.findUnique({where: {id: customerId}, include: {pets: true}});
        if(!customer) {
          throw boom.notFound('Customer does not exists');
        }
        if(!customer.pets.some(pet => pet.id === appointment.petId)) {
          throw boom.badRequest(`Customer ${customerId} is not owner of Pet ${petId}`);
        }
      }
      if(petId) {
        const pet = await prisma.pet.findUnique({where: {id: petId}});
        if(!pet) {
          throw boom.notFound('Pet not found');
        }
        if(pet.customerId !== appointment.customerId) {
          throw boom.badRequest(`Pet ${petId} does not belong to Customer ${appointment.customerId}`);
        }
      }
    }    
    const updatedAppointment = await prisma.appointment.update({where: {id}, data: changes});
    return updatedAppointment;
  }

  async delete(id: number): Promise<string> {
    const appointment = await prisma.appointment.delete({where: {id}});
    return `Appointment ${appointment.id} deleted`
  }
}

export default AppointmentService;