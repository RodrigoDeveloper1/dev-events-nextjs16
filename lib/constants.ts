export interface Event {
    title: string;
    image: string;
    location: string;
    date: string;
    time: string;
    slug: string;
}

export const events: Event[] = [
    {
        title: "Next.js Conf 2025",
        image: "/images/event1.png",
        location: "San Francisco, CA",
        date: "Oct 25, 2025",
        time: "09:00 AM",
        slug: "nextjs-conf-2025"
    },
    {
        title: "React Summit",
        image: "/images/event2.png",
        location: "Amsterdam, NL",
        date: "Jun 14, 2025",
        time: "10:00 AM",
        slug: "react-summit-2025"
    },
    {
        title: "JSWorld Conference",
        image: "/images/event3.png",
        location: "Madrid, ES",
        date: "Mar 12, 2025",
        time: "08:30 AM",
        slug: "jsworld-conference"
    },
    {
        title: "DevNexus 2025",
        image: "/images/event4.png",
        location: "Atlanta, GA",
        date: "Apr 04, 2025",
        time: "09:00 AM",
        slug: "devnexus-2025"
    },
    {
        title: "AI & Big Data Expo",
        image: "/images/event5.png",
        location: "London, UK",
        date: "Dec 01, 2025",
        time: "11:00 AM",
        slug: "ai-big-data-expo"
    },
    {
        title: "HackMIT 2025",
        image: "/images/event6.png",
        location: "Cambridge, MA",
        date: "Sep 15, 2025",
        time: "12:00 PM",
        slug: "hackmit-2025"
    }
];
