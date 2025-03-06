import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class UpdateConfidenceDto {
  @ApiProperty({
    description: 'The email address of the participant',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Confidence level in identifying scams (1-5)',
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  confidence: number;
}
