import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketAdapter } from './ws/adapters/socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 应用WebSocket适配器
  // app.useWebSocketAdapter(new SocketAdapter(app));

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
