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
    title: { type: String, required: [true, 'Title is required'] },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: [true, 'Description is required'] },
    overview: { type: String, required: [true, 'Overview is required'] },
    image: { type: String, required: [true, 'Image URL is required'] },
    venue: { type: String, required: [true, 'Venue is required'] },
    location: { type: String, required: [true, 'Location is required'] },
    date: { type: String, required: [true, 'Date is required'] },
    time: { type: String, required: [true, 'Time is required'] },
    mode: { type: String, required: [true, 'Mode is required'] },
    audience: { type: String, required: [true, 'Audience is required'] },
    agenda: { type: [String], required: [true, 'Agenda is required'] },
    organizer: { type: String, required: [true, 'Organizer is required'] },
    tags: { type: [String], required: [true, 'Tags are required'] },
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
  // Generate slug if the title is modified
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

    // Note: next() is optional in Mongoose 5.x+ for synchronous hooks
});

//Proper helper written by myself
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
