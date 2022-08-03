import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { comparePassword } from '../utils/hash';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && comparePassword(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
