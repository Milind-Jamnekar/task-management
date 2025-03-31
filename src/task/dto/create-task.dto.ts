import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsEnum([true, false])
  @IsNotEmpty()
  isDone: boolean;
}
