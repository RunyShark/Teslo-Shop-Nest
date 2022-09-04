import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';
import Succes from 'src/utils/success.dictiionary';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  mcreate(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-token')
  @Auth()
  checkAuth(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') email: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: 'wenaws',
      msg: 'ok',
      user,
      email,
      rawHeaders,
      headers,
    };
  }

  // @SetMetadata('roles', ['admin'])
  @Get('private2')
  @RoleProtected(ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: 'wenaws',
      msg: 'ok',
      user,
    };
  }

  @Get('private3')
  @Auth()
  privateRoute3(@GetUser() user: User) {
    return {
      ok: 'wenaws',
      msg: 'ok',
      user,
    };
  }
}
// @Req() request: Express.Request
