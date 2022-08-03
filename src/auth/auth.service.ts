import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Cache from 'cache-manager';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { comparePassword } from '../utils/hash';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';

const RESET_PASSWORD_EXPIRE = 1000 * 60 * 60;

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly usersService: UsersService,
    @Inject('EMAIL_SERVICE') private readonly emailsService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && comparePassword(password, user.password)) {
      return user;
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

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new NotFoundException();

    const token = uuidv4();

    await this.cacheManager.set(token, user.username, {
      ttl: RESET_PASSWORD_EXPIRE,
    });

    await this.sendForgotPasswordEmail(user.email, user.firstName, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const username = await this.cacheManager.get(resetPasswordDto.token);

    if (!username) throw new BadRequestException('Invalid Request!');

    const user = await this.usersService.findByUsername(username);

    if (!user) throw new NotFoundException('User not found!');

    if (resetPasswordDto.passwordConfirmation !== resetPasswordDto.password)
      throw new BadRequestException('Password does not match!');

    await this.cacheManager.del(resetPasswordDto.token);

    await this.usersService.updatePassword(user._id, resetPasswordDto.password);
  }

  private async sendForgotPasswordEmail(
    email: string,
    name: string,
    token: string,
  ) {
    const url = `localhost:8080/api/auth/reset-password/${token}`;

    await this.emailsService.sendEmail(
      email,
      'Reset password email',
      './forgot-password',
      {
        name,
        url,
      },
    );
  }
}
