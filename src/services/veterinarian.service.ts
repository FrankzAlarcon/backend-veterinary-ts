import boom from '@hapi/boom';
import bcrypt from 'bcrypt';
import { Appointment, PrismaClient, Task, Veterinarian } from '@prisma/client';
import { CreateVeterinarian, UpdateVeterinarian, TotalUpdateVeterinarian, CreateTask, UpdateTask } from '../types/veterinarian';

const prisma = new PrismaClient();
class VeterinarianService {

  async getAll(): Promise<Veterinarian[]> {
    const veterinarians = await prisma.veterinarian.findMany();
    return veterinarians;
  }

  async getOne(id: number): Promise<Veterinarian> {
    const veterinarian = await prisma.veterinarian.findUnique({where: {id}});
    if(!veterinarian) {
      throw boom.notFound('Veterinarian not found');
    }
    return veterinarian;
  }

  async getAllTasks(id: number): Promise<Task[]> {
    const tasks = await prisma.task.findMany({where: { veterinarianId: id }});
    if(!tasks) {
      throw boom.badRequest('Veterinarian does not exists');
    }
    return tasks;
  }

  async getAllAppointments(id: number): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({where: {veterinarianId: id} });
    if(!appointments) {
      throw boom.badRequest('Veterinarian does not exists');
    }
    return appointments;
  }

  async create(body: CreateVeterinarian): Promise<Veterinarian> {
    const password = await bcrypt.hash(body.password, 10);
    const veterinarianData:CreateVeterinarian = {
      ...body,
      password
    }
    const existVeterinarian = await prisma.veterinarian.findUnique({where: {email: body.email}});
    if(existVeterinarian) {
      throw 'Ya existe un usuario con ese email';
    }
    const veterinarian = await prisma.veterinarian.create({data: veterinarianData});
    return veterinarian;
  }

  async createTask(id: number, body: CreateTask): Promise<Task> {
    const veterinarian = await prisma.veterinarian.findUnique({where: {id}});
    if(!veterinarian) {
      throw boom.notFound('Veterinarian not found');
    }
    const task = await prisma.task.create({data: {
      ...body,
      veterinarianId: id
    }});
    return task;
  }

  async totalUpdate(id: number, changes: TotalUpdateVeterinarian): Promise<Veterinarian> {
    const veterinarian =  await prisma.veterinarian.update({where: {id}, data: changes});
    if(!veterinarian) {
      throw boom.notFound('Incorrect or missing id')
    }
    return veterinarian;
  }

  async partialUpdate(id: number, changes: UpdateVeterinarian): Promise<Veterinarian> {
    const veterinarian = await prisma.veterinarian.update({where: {id}, data: changes})
    if(!veterinarian) {
      throw boom.notFound('Incorrect or missing id')
    }
    return veterinarian;
  }

  async updateTask(veterinarianId: number, taskId: number, changes: UpdateTask): Promise<Task> {
    const veterinarian =  await prisma.veterinarian.findUnique({
      where: {id: veterinarianId},
      include: {tasks: true}
    });
    if(!veterinarian) {
      throw boom.notFound('Veterinarian not found');
    }
    if(!veterinarian.tasks.some((task) => task.id === taskId)) {
      throw boom.forbidden(`Task ${taskId} does not belong to Veterinarian ${veterinarianId}`);
    }
    const task = await prisma.task.update({where: {id: taskId}, data: changes});
    return task;
  }

  async delete(id: number): Promise<string> {
    const veterinarianDeleted = await prisma.veterinarian.delete({where: {id}})
    if(!veterinarianDeleted) {
      throw boom.notFound('Incorrect or missing id')
    }
    return `Deleted veterinarian ${veterinarianDeleted.id}`;
  }

  async deleteTask(veterinarianId: number, taskId: number): Promise<string> {
    const veterinarian =  await prisma.veterinarian.findUnique({
      where: { id: veterinarianId},
      include: { tasks: true }
    });
    if(!veterinarian) {
      throw boom.notFound('Veterinarian not found');
    }
    if(!veterinarian.tasks.some((task) => task.id === taskId)) {
      throw boom.forbidden(`Task ${taskId} does not belong to Veterinarian ${veterinarianId}`)
    }
    const taskDeleted = await prisma.task.delete({where: {id: taskId}});
    return `Deleted task ${taskDeleted.id}`;
  }
}

export default VeterinarianService;