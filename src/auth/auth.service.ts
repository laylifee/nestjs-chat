import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { ...user };
    console.log('Login payload:', payload);
    if (!payload.email) {
      throw new UnauthorizedException('Email is required for login');
    }
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 通过令牌获取用户信息
  async validateUserByToken(token: string) {
    try {
      // 移除可能的 "Bearer " 前缀
      token = token.replace('Bearer ', '');

      // 验证并解码令牌
      const decoded = this.jwtService.verify(token);

      // 根据解码信息查找用户
      // const user = await this.userService.findByEmail(decoded.email);
      let data = await this.userService.findByEmail(decoded.email);
      return data;
      // 暂时直接返回解码后的 payload（测试用）
    } catch (error) {
      // 抛出带有明确信息的未授权异常
      throw new UnauthorizedException({
        code: 401,
        message: 'Token expired',
        error: 'UNAUTHORIZED', // 标准错误类型标识
      });
    }
  }
}
