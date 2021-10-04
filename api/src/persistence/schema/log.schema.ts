import * as mongoose from 'mongoose';

export const LogSchema = new mongoose.Schema({
  container_id: String,
  start_time: Date,
  stop_time: Date,
});