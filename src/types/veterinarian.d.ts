type ID = string | number;

interface Veterinarian {
  id: ID,
  name: string,
  email: string,
  password: string,
}

export type CreateVeterinarian = Omit<Veterinarian, 'id'>;

export type TotalUpdateVeterinarian = Omit<Veterinarian, 'id' | 'password'>;

export type UpdateVeterinarian = Partial<CreateVeterinarian>;

interface Task {
  id: number,
  text: string,
  priority: 'HIGH' | 'MEDIUM' | 'LOW',
  veterinarianId: number
}

export type CreateTask = Omit<Task, 'id' | 'veterinarianId'>;

export type UpdateTask = Partial<CreateTask>