import { ApiProperty } from '@nestjs/swagger';

export class CreateCapture {
  @ApiProperty()
  url: string;
}