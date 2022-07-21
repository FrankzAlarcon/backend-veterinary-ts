import { PrismaClient, Customer, Pet } from "@prisma/client";
import boom from '@hapi/boom'
import { CreateCustomer, CreatePet, UpdateCustomer, UpdatePet } from "../types/customer";

const prisma = new PrismaClient();
class CustomerService {

  async getAll(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany();
    return customers;
  }

  async getOne(id: number, veterinarianId: number): Promise<Customer> {
    const customer = await prisma.customer.findUnique({where: { id }, include: {pets: true, appointments: {
      where: {veterinarianId},
      include: {pet: true}
    }}});
    if(!customer) {
      throw boom.notFound('Customer not found');
    }
    return customer;
  }

  async getOneByEmail(email: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({where: {email}, include: {pets: true, appointments: true}});
    return customer;
  }

  async create(body: CreateCustomer): Promise<Customer> {
    const customer = await prisma.customer.create({data: body});
    return customer;
  }

  async addPet(id: number, body: CreatePet): Promise<Pet> {
    const customer = await prisma.customer.findUnique({where: {id}});
    if(!customer) {
      throw boom.notFound('Customer not found');
    }
    const pet = await prisma.pet.create({data: {
      ...body,
      customerId: id
    }});
    return pet;
  }

  async totalUpdate(id: number, changes: CreateCustomer): Promise<Customer> {
    const customer = await prisma.customer.update({where: {id}, data: changes});
    return customer;
  }

  async partialUpdate(id: number, changes: UpdateCustomer): Promise<Customer> {
    const customer = await prisma.customer.update({where: {id}, data: changes});
    return customer;
  }

  async updatePet(customerId: number, petId:number, changes: UpdatePet) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { pets: true }
    });
    if(!customer) {
      throw boom.notFound('Customer not found');
    }
    if(!customer.pets.some((pet) => pet.id === petId)) {
      throw boom.forbidden(`Pet ${petId} does not belong to Customer ${customerId}`);
    }
    const pet = prisma.pet.update({where: {id: petId}, data: changes});
    return pet;
  }

  async deleteOne(id: number): Promise<string> {
    const customerDeleted = await prisma.customer.delete({where: {id}});
    if(!customerDeleted) {
      throw boom.notFound('Customer not found');
    }    
    return `Customer ${id} deleted`;
  }

  async deletePet(customerId: number, petId: number) {
    const customer = await prisma.customer.findUnique({where: {id: customerId}, include: {pets: true}});
    if(!customer) {
      throw boom.notFound('Customer not found');
    }
    if(!customer.pets.some(pet => pet.id === petId)) {
      throw boom.forbidden(`Pet ${petId} does not belong to Customer ${customerId}`);
    }
    const petDeleted = await prisma.pet.delete({where: {id: petId}});
    return `Pet ${petDeleted.id} deleted`
    
  }
}

export default CustomerService;