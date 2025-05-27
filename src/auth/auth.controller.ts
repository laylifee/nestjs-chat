import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: CreateUserDto) {
    let data = await this.authService.login(loginUserDto);
    console.log('Login response:', data);
    return {
      access_token: data.access_token,
      code: 200,
      message: 'Login successful',
    };
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request: Request) {
    console.log('Profile request:', request);
    // const profile = await this.authService.validateUserByToken(user.id);
    // return {
    //   code: 200,
    //   message: 'Profile retrieved successfully',
    //   data: profile,
    // };
  }
}
