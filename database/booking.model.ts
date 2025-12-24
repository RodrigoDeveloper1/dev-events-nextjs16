import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Interface representing a Booking document in MongoDB.
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to verify that the referenced Event exists.
 */
bookingSchema.pre('save', async function () {
  if (this.isModified('eventId')) {
    const Event = mongoose.model('Event');
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      const error = new Error(`Referenced event with ID ${this.eventId} does not exist`);
      error.name = 'ValidationError';

      throw error;
      //next(error); According to ChatGPT I am ignoring this function calling for now
    }
  }
  //next(); According to ChatGPT I am ignoring this function calling for now
});

//Indexes that June doesn't generate for some reason
bookingSchema.index({ eventId: 1 }); // Create index on eventId for faster queries
bookingSchema.index({ eventId: 1, createdAt: -1 }); // Create compound index for common queries (events bookings by date)
bookingSchema.index({ email: 1 }, { unique: true }); // Create index on email for user booking lookups
// Enforce one booking per events per email
bookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });
const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;