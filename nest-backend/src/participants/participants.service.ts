import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Participant, ParticipantDocument } from '../models/participant.model';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant.name)
    private participantModel: Model<ParticipantDocument>,
  ) {}

  async create(createParticipantDto: CreateParticipantDto): Promise<Participant> {
    console.log('Creating participant:', createParticipantDto);
    const createdParticipant = new this.participantModel({
      ...createParticipantDto,
      isOTP: false,
      isTNC: false,
      surveyAnswers: null
    });
    const savedParticipant = await createdParticipant.save();
    console.log('Participant saved:', savedParticipant);
    return savedParticipant;
  }

  async updateOTPStatus(email: string): Promise<Participant> {
    const participant = await this.participantModel.findOne({ email });
    if (!participant) {
      throw new NotFoundException(`Participant with email ${email} not found`);
    }
    participant.isOTP = true;
    return participant.save();
  }
}
