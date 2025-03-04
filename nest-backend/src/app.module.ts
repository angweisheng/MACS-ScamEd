import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantsModule } from './participants/participants.module';
import { HealthController } from './health.controller';
import { OtpModule } from './otp/otp.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const MONGO_CONNECTION = env.MONGO_CONNECTION;
        if (!MONGO_CONNECTION) {
          throw new Error('MONGO_CONNECTION is required');
        }
        return env;
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION as string),
    ParticipantsModule,
    OtpModule,
    EmailModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
