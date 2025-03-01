import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipantDocument = Participant & Document;

@Schema({ collection: 'participant' })
export class Participant {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: Object })
  surveyAnswers: any;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
