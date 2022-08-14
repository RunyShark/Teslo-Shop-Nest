import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt.interface';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger('JwtStrategy');
  constructor(
    @InjectRepository(User) private readonly userRepositorio: Repository<User>,

    configService: ConfigService,
  ) {
    super({
      secretOrkey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    try {
      const { email } = payload;

      const user = await this.userRepositorio.findOneBy({ email });

      if (!user) throw new UnauthorizedException('Token not valid');

      if (!user.isActive)
        throw new UnauthorizedException('User is inactive, talk with an admin');

      return user;
    } catch (error) {
      this.handleJWTExceptions(error);
    }
  }
  private handleJWTExceptions(error: any): never {
    //console.log(error);
    if (error.response) throw new BadRequestException(error.message);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.code === '23502') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
