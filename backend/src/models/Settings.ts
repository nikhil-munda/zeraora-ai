import mongoose, { Schema } from 'mongoose';

export interface ISettings {
  userId: mongoose.Types.ObjectId;
  model: string;
  temperature: number;
  top_k: number;
  allowed_sources: string[];
  show_sources: boolean;
}

const SettingsSchema = new Schema<ISettings>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  model: { type: String, default: 'GPT-4' },
  temperature: { type: Number, default: 0.7, min: 0, max: 1 },
  top_k: { type: Number, default: 5 },
  allowed_sources: { 
    type: [String], 
    default: ['pdf', 'website', 'github', 'youtube', 'arxiv'],
    enum: ['pdf', 'website', 'github', 'youtube', 'arxiv'] 
  },
  show_sources: { type: Boolean, default: true }
});

export default mongoose.model<ISettings>('Settings', SettingsSchema);
