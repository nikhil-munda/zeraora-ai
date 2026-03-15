import mongoose, { Document, Schema } from 'mongoose';

export interface ISource extends Document {
  name: string;
  type: string;
  status: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SourceSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['pdf', 'website', 'github', 'youtube', 'arxiv'] },
  status: { type: String, required: true, default: 'processing', enum: ['processing', 'indexed', 'failed'] },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISource>('Source', SourceSchema);
