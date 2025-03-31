import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as z from 'zod';

const configValidationSchema = z.object({
  MYSQL_HOST: z.string(),
  MYSQL_PORT: z.string().transform((val) => parseInt(val, 10)),
  MYSQL_USERNAME: z.string(),
  MYSQL_PASSWORD: z.string(),
  MYSQL_DATABASE: z.string(),
  SECRET_KEY: z.string(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => {
        const parsed = configValidationSchema.safeParse(config);
        if (!parsed.success) {
          throw new Error(`Config validation error: ${parsed.error.message}`);
        }
        return parsed.data;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TaskModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
