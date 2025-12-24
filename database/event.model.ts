import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing an Event document in MongoDB.
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true },
    audience: { type: String, required: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook for:
 * 1. Generating a slug from the title if it changed.
 * 2. Normalizing date to ISO format.
 * 3. Ensuring consistent time format.
 */
eventSchema.pre('save', function () {
  // Generate slug if title is modified
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO string if modified
  if (this.isModified('date')) {
    const parsedDate = new Date(this.date);
    if (!isNaN(parsedDate.getTime())) {
      this.date = parsedDate.toISOString().split('T')[0]; // Store as YYYY-MM-DD for consistency
    }
  }

  // Basic time normalization (ensuring trim)
  if (this.isModified('time')) {
    this.time = this.time.trim();
  }

  //next(); According to ChatGPT I am ignoring this function calling for now
});

//Proper helper wrote by myself
function generateSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

//Indexes that June doesn't generate for some reason
eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ date: 1, mode: 1 });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
