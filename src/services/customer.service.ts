import { CreateCustomer, CreatePet, Customer, ID, Pet, UpdateCustomer } from "../types/types";
import Chance from "chance";

const chance = new Chance();

class CustomerService {

  private customers: Customer[] = [];
  
  constructor() {
    this.generate();
  }

  generate(): void {
    for (let i = 0; i < 20; i++) {
      this.customers.push({
        id: chance.guid(),
        name: chance.name(),
        email: chance.email(),
        pets: [
          {
            id: chance.guid(),
            petName: chance.name(),
            animalType: chance.animal({type: 'pet'})
          },
          {
            id: chance.guid(),
            petName: chance.name(),
            animalType: chance.animal({type: 'pet'})
          }
        ]
      })
    }
  }

  getAll(): Customer[] {
    return this.customers;
  }

  getOne(id: ID): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  create(body: CreateCustomer): Customer {
    const newCustomer = {
      id: chance.guid(),
      ...body,
      pets: []
    }
    this.customers.push(newCustomer);
    return newCustomer;
  }

  addPet(id: ID, body: CreatePet): Pet {
    const customerIndex = this.customers.findIndex(customer => customer.id === id);
    if(customerIndex === -1) {
      throw new Error('Customer not found');
    }
    const newPet = {
      id: chance.guid(),
      ...body
    };
    if(!this.customers[customerIndex].pets) {
      this.customers[customerIndex].pets = [];
    }
    this.customers[customerIndex].pets?.push(newPet);    
    return newPet;
  }

  totalUpdate(id: ID, changes: CreateCustomer): Customer {
    const customerIndex = this.customers.findIndex(customer => customer.id === id);
    if(customerIndex === -1) {
      throw new Error('Customer not found');
    }
    const customerToUpdate = this.customers[customerIndex];
    this.customers[customerIndex] = {
      ...customerToUpdate,
      ...changes
    };
    return this.customers[customerIndex];    
  }

  partialUpdate(id: ID, changes: UpdateCustomer): Customer {
    const customerIndex = this.customers.findIndex(customer => customer.id === id);
    if(customerIndex === -1) {
      throw new Error('Customer not found');
    }
    const customerToUpdate = this.customers[customerIndex];
    this.customers[customerIndex] = {
      ...customerToUpdate,
      ...changes
    }

    return this.customers[customerIndex];
  }

  deleteOne(id: ID): string {
    const customerIndex = this.customers.findIndex(customer => customer.id === id);
    if(customerIndex === -1) {
      throw new Error('Customer not found');
    }
    this.customers.splice(customerIndex, 1);
    return `Customer ${id} was deleted`;
  }
}

export default CustomerService;