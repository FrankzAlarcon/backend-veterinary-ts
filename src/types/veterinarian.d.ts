type ID = string | number;

interface Veterinarian {
  id: ID,
  name: string,
  email: string,
  password: string,
  token: string?
}

export type CreateVeterinarian = Omit<Veterinarian, 'id' | 'token'>;

export type TotalUpdateVeterinarian = Omit<Veterinarian, 'id' | 'password' | 'token'>;

export type UpdateVeterinarian = Partial<CreateVeterinarian>;

export type VerifyVeterinarianAccount = Omit<Veterinarian, 'password' | 'id'>;

interface Task {
  id: number,
  text: string,
  priority: 'HIGH' | 'MEDIUM' | 'LOW',
  veterinarianId: number
}

export type CreateTask = Omit<Task, 'id' | 'veterinarianId'>;

export type UpdateTask = Partial<CreateTask>