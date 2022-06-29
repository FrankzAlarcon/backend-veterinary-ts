interface Customer {
  id: number,
  name: string,
  email: string,
}

interface Pet {
  id: number,
  name: string,
  animalType: string,
}

export type CreateCustomer = Omit<Customer, 'id' >

export type UpdateCustomer = Partial<CreateCustomer>;

export type CreatePet = Omit<Pet, 'id'>;

export type UpdatePet = Partial<CreatePet>
