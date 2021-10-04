import { Document } from 'mongoose';

export interface Log extends Document {
  readonly container_id: string;
  readonly start_time: Date;
  readonly stop_time: Date;
}