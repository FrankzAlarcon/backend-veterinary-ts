type ID = string | number;

export interface Veterinarian {
  id: ID,
  name: string,
  email: string,
  password: string,
}

export type CreateVeterinarian = Omit<Veterinarian, 'id'>;

export type UpdateVeterinarian = Partial<CreateVeterinarian>

interface Customer extends Veterinarian {
  petName: string
}

interface Pet {
  id: ID,
  petName: string,
  animalType: string,
}