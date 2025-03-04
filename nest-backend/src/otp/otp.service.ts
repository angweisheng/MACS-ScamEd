import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Injectable()
export class OtpService {
  private otpStore: Map<string, { otp: string; expires: Date }> = new Map();

  constructor(private emailService: EmailService) {}

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTP(email: string): Promise<void> {
    const otp = this.generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    this.otpStore.set(email, { otp, expires });
    await this.emailService.sendOTP(email, otp);
  }

  verifyOTP(email: string, otp: string): boolean {
    const storedOTP = this.otpStore.get(email);
    if (!storedOTP) return false;
    if (storedOTP.expires < new Date()) {
      this.otpStore.delete(email);
      return false;
    }
    if (storedOTP.otp === otp) {
      this.otpStore.delete(email);
      return true;
    }
    return false;
  }
}