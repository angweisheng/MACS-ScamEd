import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ParticipantsService } from 'src/participants/participants.service';

@Injectable()
export class OtpService {
  private otpStore: Map<string, { otp: string; expires: Date }> = new Map();

  constructor(private emailService: EmailService, private participantsService: ParticipantsService) {}

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email: string): Promise<void> {
    const otp = this.generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    this.otpStore.set(email, { otp, expires });
    await this.emailService.sendOTP(email, otp);
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOTP = this.otpStore.get(email);
    if (!storedOTP) return false;

    if (Date.now() > storedOTP.expires.getTime()) {
      this.otpStore.delete(email);
      return false;
    }

    if (storedOTP.otp === otp) {
      this.otpStore.delete(email);
      try {
        await this.participantsService.updateOTPStatus(email);
        return true;
      } catch (error) {
        if (error instanceof NotFoundException) {
          // Handle case where participant is not found
          console.error(`Participant with email ${email} not found during OTP verification`);
        }
        throw error;
      }
    }

    return false;
  }
}