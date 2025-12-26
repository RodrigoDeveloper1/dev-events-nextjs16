'use server';

import dbConnect from "@/lib/mongodb";
import Event from "@/database/event.model";

export const getSimilarEventBySlug = async(slug: string) => {
    try {
        await dbConnect();

        const event = await Event.findOne({ slug });
        return event ? await Event.find({ _id: { $ne: event._id}, tags: { $in: event.tags }}).lean() : [];
    }
    catch {
        return []
    }
}