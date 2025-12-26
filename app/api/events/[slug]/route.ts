import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/database/event.model";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(req: NextRequest, { params } : RouteContext) {
    try {
        await dbConnect();

        const {slug} = await params;
        const event = await Event.findOne({slug});

        if (!event) return new Response(`Event with slug '${slug}' not found'`, {status: 404});

        return NextResponse.json({message: 'Event fetch successfully', event}, {status: 200});

    } catch (e) {
        console.error(e);
        return NextResponse.json({message: 'Cannot get the event', error: e instanceof Error ? e.message : 'Unknown Error'}, {status: 500});
    }
}