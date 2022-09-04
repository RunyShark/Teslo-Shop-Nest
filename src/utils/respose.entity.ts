import { Type } from '@nestjs/common';

export class ApiResponse {
  status: number;
  description: string;
  type?: Type<unknown> | Function | [Function] | string;
}
