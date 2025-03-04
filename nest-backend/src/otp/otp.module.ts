import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { EmailService } from '../email/email.service';
import { OtpController } from './otp.controller';

@Module({
  providers: [OtpService, EmailService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}