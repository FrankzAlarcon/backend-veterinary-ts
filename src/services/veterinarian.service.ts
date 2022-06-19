import Chance from 'chance';
import boom from '@hapi/boom';
import { CreateVeterinarian, UpdateVeterinarian, Veterinarian } from '../types/types';

const chance = new Chance;

class VeterinarianService {

  private veterinarians: Veterinarian[] = [];

  constructor() {
    this.generate();
  }

  private generate(): void {
    for (let i = 0; i < 20 ; i++) {      
      this.veterinarians.push({
        id: chance.guid(),
        name: chance.name(),
        email: chance.email(),
        password: chance.word({capitalize: true, length: 10})
      })
    }
  }

  getAll(): Veterinarian[] {
    return this.veterinarians;
  }

  getOne(id: string): Veterinarian | undefined {
    return this.veterinarians.find(vet => vet.id === id);
  }

  create(body: CreateVeterinarian): Veterinarian {
    const newVet = {
      id: chance.guid(),
      ...body
    }
    this.veterinarians.push(newVet);
    return newVet;
  }

  totalUpdate(id: string, changes: CreateVeterinarian): Veterinarian {
    const indexVetToUpdate = this.veterinarians.findIndex(vet => vet.id === id);
    if(indexVetToUpdate === -1) {
      throw boom.badRequest('Incorrect or missing id')
    }
    const vetToUpdate = this.veterinarians[indexVetToUpdate];
    this.veterinarians[indexVetToUpdate] = {
      ...vetToUpdate,
      ...changes
    }
    return this.veterinarians[indexVetToUpdate];
  }

  partialUpdate(id: string, changes: UpdateVeterinarian): Veterinarian {
    const indexVetToUpdate = this.veterinarians.findIndex(vet => vet.id === id);
    if(indexVetToUpdate === -1) {
      throw boom.badRequest('Incorrect or missing id')
    }
    const vetToUpdate = this.veterinarians[indexVetToUpdate];
    this.veterinarians[indexVetToUpdate] = {
      ...vetToUpdate,
      ...changes
    }
    return this.veterinarians[indexVetToUpdate];
  }

  delete(id: string): string {
    const indexVetToUpdate = this.veterinarians.findIndex(vet => vet.id === id);
    if(indexVetToUpdate === -1) {
      throw boom.badRequest('Incorrect or missing id')
    }
    this.veterinarians.splice(indexVetToUpdate, 1)
    return `Veterinarian ${id} was deleted correctly`;
  }
}

export default VeterinarianService;