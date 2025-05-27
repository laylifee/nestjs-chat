import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth/auth.service';

export class SocketAdapter extends IoAdapter {
  private jwtService: JwtService;
  private authService: AuthService;

  constructor(app: any) {
    super(app);
    this.jwtService = app.get(JwtService);
    this.authService = app.get(AuthService);
  }

  create(port: number, options?: ServerOptions): any {
    const server = super.create(port, options);

    server.use(async (socket: any, next: any) => {
      try {
        const token = socket.handshake.query.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const payload = this.authService.validateUserByToken(token);
        socket.user = payload;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    return server;
  }
}
