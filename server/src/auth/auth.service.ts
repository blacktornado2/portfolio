import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';

const DUMMY_HASH = '$2b$12$invalidhashpaddingtoensureconstanttimeXXXXXXXXXXXXXXXX';

@Injectable()
export class AuthService {
  private readonly adminUsername = process.env.ADMIN_USERNAME;
  private readonly adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const usernameMatches = username === this.adminUsername;
    const hashToCompare = usernameMatches
      ? (this.adminPasswordHash as string)
      : DUMMY_HASH;

    const isPasswordValid = await bcrypt.compare(password, hashToCompare);

    if (!usernameMatches || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { accessToken: this.jwtService.sign({ sub: username }) };
  }
}
