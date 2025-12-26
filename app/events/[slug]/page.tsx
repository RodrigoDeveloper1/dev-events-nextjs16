import {notFound} from "next/dist/client/components/not-found";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import {IEvent} from "@/database/event.model";
import {getSimilarEventBySlug} from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon, alt, label}:{icon:string, alt:string, label:string}) => (
    <div className={"flex-row-gap-2 items-center"}>
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems } : {agendaItems: string[]}) => (
    <div className={"agenda"}>
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags } : {tags: string[]}) => (
    <div className={"flex flex-row gap-1.5 flex-wrap"}>
        {tags.map((tag) => (
            <div className={"pill"} key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string}>}) => {
    const {slug} = await params;
    const request = await fetch(`${BASE_URL}/api/events/${slug}`);
    const {event: {title, description, overview, image, venue, location, date, time, mode, audience, agenda, organizer, tags}} = await request.json();

    const bookings = 10;
    const similarEvents: IEvent[] = await getSimilarEventBySlug(slug);

    if(!description) return notFound();

    return (
        <div>
            <section id="event">
                <div className="header">
                    <h1>{title}</h1>
                    <p className={"mt-2"}>{description}</p>
                </div>

                <div className={"details"}>
                    { /*Left side - event content*/ }
                    <div className={"content"}>
                        <Image src={image} alt={"Event Banner"} width={800} height={800} className={"banner"}/>

                        <section className={"flex-col-gap-2"}>
                            <h2>Event Overview</h2>
                            <p>{overview}</p>
                        </section>
                        <section className={"flex-col-gap-2"}>
                            <h2>Event Details</h2>
                            <EventDetailItem icon={"/icons/calendar.svg"} alt={"date"} label={date}/>
                            <EventDetailItem icon={"/icons/clock.svg"} alt={"time"} label={time}/>
                            <EventDetailItem icon={"/icons/pin.svg"} alt={"location"} label={`${location} | ${venue}`}/>
                            <EventDetailItem icon={"/icons/mode.svg"} alt={"mode"} label={mode}/>
                            <EventDetailItem icon={"/icons/audience.svg"} alt={"audience"} label={audience}/>
                        </section>

                        <EventAgenda agendaItems={agenda}/>

                        <section className={"flex-col-gap-2"}>
                            <h2>About the Organizer</h2>
                            <p>{organizer}</p>
                        </section>

                        <EventTags tags={tags}/>
                    </div>

                    { /*Right side - event details */ }
                    <aside className={"booking"}>
                        <div className={"signup-card"}>
                            <h2 className={"text-lg font-semibold"}>Book Your Spot</h2>
                            {bookings > 0 ? (
                                <p className="text-sm">Join {bookings} other attendees</p>
                            ): (
                                <p className="text-sm">Be the first to book your spot!</p>
                            )}

                            <BookEvent/>
                        </div>
                    </aside>
                </div>
            </section>

            <div className={"flex w-full flex-col gap-4 pt-20"}>
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 && similarEvents.map((event) => (
                        <EventCard {...event} key={event.slug} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EventDetailsPage