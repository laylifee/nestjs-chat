import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { jwtConstants } from './contants';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs a JWT strategy instance with configuration options.
   * @param userService - User service instance for user validation
   * @config jwtFromRequest - Extracts JWT from Authorization header as Bearer token
   * @config ignoreExpiration - Flag to reject expired tokens (false by default)
   * @config secretOrKey - Secret key for token verification
   */
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);
    // payload.sub 是用户的 ID
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log('User found in JWT strategy:', user);
    return user; // 返回完整的 User 实体
  }
}
