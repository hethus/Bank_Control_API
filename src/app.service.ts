import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'App is running! Documentation: http://localhost:8000/docs';
  }
}
