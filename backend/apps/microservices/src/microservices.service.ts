import { Injectable } from '@nestjs/common';

@Injectable()
export class MicroservicesService {
  getHello(): string {
    return 'Test microservice!';
  }
}
