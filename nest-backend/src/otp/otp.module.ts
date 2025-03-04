import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { EmailService } from '../email/email.service';
import { OtpController } from './otp.controller';
import { EmailModule } from 'src/email/email.module';
import { ParticipantsModule } from 'src/participants/participants.module';

@Module({
  imports: [EmailModule, ParticipantsModule],
  providers: [OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}