import mongoose, { Document, Schema } from 'mongoose';

interface ISourceItem {
  type: string;
  name?: string;
  url?: string;
  file?: string;
}

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  sources: ISourceItem[];
  createdAt: Date;
}

const SourceItemSchema = new Schema({
  type: { type: String, required: true, enum: ['pdf', 'website', 'github', 'youtube', 'arxiv'] },
  name: { type: String },
  url: { type: String },
  file: { type: String }
}, { _id: false });

const HistorySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  sources: { type: [SourceItemSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IHistory>('History', HistorySchema);
