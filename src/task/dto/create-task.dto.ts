import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  isDone: boolean;
}
