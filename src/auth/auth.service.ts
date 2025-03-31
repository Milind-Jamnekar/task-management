import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signUp(payload: SignUpDto): Promise<any> {
    const user = await this.userService.findOne(payload.username);
    const hashedPassword = await this.hashPassword(payload.password);
    const newUser = await this.userService.create(
      payload.username,
      hashedPassword,
    );

    if (!newUser) {
      throw new InternalServerErrorException('Problem with creating user');
    }

    const pay = { sub: user.id, username: user.username };

    return { access_token: await this.jwtService.signAsync(pay) };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
