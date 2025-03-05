import { Controller, Post, Body, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OtpService } from './otp.service';

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send OTP to email' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' }
      }
    }
  })
  async sendOTP(@Body('email') email: string) {
    try {
      await this.otpService.sendOTP(email);
      return { message: 'OTP sent successfully' };
    } catch (error) {
      throw new HttpException('Failed to send OTP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP and update OTP status' })
  @ApiResponse({ status: 201, description: 'OTP verified successfully and OTP status updated' })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  @ApiResponse({ status: 404, description: 'Participant not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        otp: { type: 'string', example: '' }
      }
    }
  })
  async verifyOTP(@Body('email') email: string, @Body('otp') otp: string) {
    try {
      const isValid = await this.otpService.verifyOTP(email, otp);
      if (isValid) {
        return { message: 'OTP verified successfully and OTP status updated' };
      } else {
        throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw new HttpException('Participant not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}