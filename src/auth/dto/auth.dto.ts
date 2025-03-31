import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  // @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  // @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
