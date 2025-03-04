import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"FormSG Official" <formSG@gt.tech.gov.sg>',
      to: email,
      subject: 'One-Time Password (OTP) for FormSG',
      text: `Your OTP is ${otp}`,
      html: `Your OTP is: <b>${otp}</b>. It will expire in 10 minutes. Please use this to verify your email.`,
    });
  }
}