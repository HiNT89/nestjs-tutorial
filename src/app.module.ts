import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally
      envFilePath: '.env', // Path to the .env file
    }),
    TodoModule,
  ],
  providers: [],
})
export class AppModule {}
