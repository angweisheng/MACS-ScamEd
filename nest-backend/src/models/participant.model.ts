import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({ collection: 'participant' })
export class Participant {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isOTP: boolean;

  @Prop({ type: Number, min: 1, max: 5 })
  confidence: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
