import { Module, UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (configService.get('JWT_SECRET') === undefined)
          throw new UnauthorizedException();
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    // JwtModule.register({
    // secret: process.env.JWT_SECRET,
    // signOptions: {
    //   expiresIn: '1d',
    //   },
    // }),
  ],
  exports: [TypeOrmModule],
})
export class AuthModule {}
