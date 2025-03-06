import { Body, Controller, Post, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateConfidenceDto } from './dto/update-confidence.dto';
import { Participant } from '../models/participant.model';

@ApiTags('participants')
@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new participant' })
  @ApiResponse({
    status: 201,
    description: 'The participant has been successfully created.',
    type: Participant,
  })
  @ApiBody({ type: CreateParticipantDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body('email') email: string): Promise<Participant> {
    return this.participantsService.create(email);
  }

  @Patch('confidence')
  @ApiOperation({ summary: 'Update participant confidence level' })
  @ApiResponse({
    status: 200,
    description: 'The participant confidence has been successfully updated.',
    type: Participant,
  })
  @ApiBody({ type: UpdateConfidenceDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Participant not found.' })
  updateConfidence(@Body() updateConfidenceDto: UpdateConfidenceDto): Promise<Participant> {
    return this.participantsService.updateConfidence(
      updateConfidenceDto.email,
      updateConfidenceDto.confidence,
    );
  }
}
