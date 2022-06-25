type ID = string | number;

export interface Veterinarian {
  id: ID,
  name: string,
  email: string,
  password: string,
}

export type CreateVeterinarian = Omit<Veterinarian, 'id'>;

export type UpdateVeterinarian = Partial<CreateVeterinarian>;

export type BaseCustomer = Omit<Veterinarian, 'password'>;

interface Pet {
  id: ID,
  petName: string,
  animalType: string,
}

export interface Customer extends BaseCustomer {
  pets?: Pet[]
}

export type CreateCustomer = Omit<Customer, 'id' | 'pets' >

export type CreatePet = Omit<Pet, 'id'>;

export type UpdateCustomer = Partial<CreateCustomer>;