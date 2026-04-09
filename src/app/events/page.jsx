"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventCard from "../components/EventCard";
import { getAllEvents } from "@/lib/api";
import { eventsFilter } from "@/lib/eventsFilter";
import Spinner from "../components/Spinner";
import { SignedIn } from "@clerk/nextjs"; // <-- VIGTIGT!
import AnimatedButton from "../components/AnimatedButton";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

/* Typing animation effekt */

const heading = "Upcoming Events";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const letter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
/* Typing animation effekt */

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [loadingTarget, setLoadingTarget] = useState(null);
  const router = useRouter();
  const { user } = useUser(); // add this at top of component
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    const fetchLocations = async () => {
      const allLocations = await eventsFilter();
      console.log("all locations", locations);
      setLocations(allLocations);
      console.log("locations", locations);
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getAllEvents();

        // Sortering så den tidligste dato viser mest
        const sortedEvents = allEvents.sort((a, b) => {
          const idA = a.date || "";
          const idB = b.date || "";
          return idA.localeCompare(idB);
        });

        setEvents(sortedEvents);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteLocally = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleNavigate = (target) => {
    setLoadingTarget(target);
    setTimeout(() => {
      if (target === "create") {
        router.push("/createevents");
      } else if (target === "kunst") {
        router.push("/kunstliste");
      }
    }, 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mb-15 max-[400px]:p-0.5  max-[400px]:mx-1.5 max-400:max-w-3xl ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-10 gap-4">
        {/* <h1 className="text-3xl font-bold mb-6 font-playfair text-my-blue mt-5">Upcoming Events</h1> */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-10 gap-4"> */}
        <motion.h1 variants={container} initial="hidden" animate="visible" className="text-3xl sm:text-4xl font-bold mb-6 font-playfair text-my-blue mt-5 flex flex-wrap">
          {heading.split("").map((char, i) => (
            <motion.span key={i} variants={letter}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>
        {error && <p className="text-my-blue text-center mb-4">{error}</p>}
        {/* <SignedIn>
          <div className="flex gap-3 mb-4">
            <AnimatedButton onClick={() => handleNavigate("create")} disabled={loadingTarget === "create"} className="flex items-center gap-2">
              {loadingTarget === "create" ? (
                <>
                  <Spinner color="white" />
                  Åbner...
                </>
              ) : (
                "CreateEvent"
              )}
            </AnimatedButton>
          </div>
        </SignedIn> */}
        {isAdmin && (
          <div className="flex gap-3 mb-4">
            <AnimatedButton onClick={() => handleNavigate("create")}>Opret Event</AnimatedButton>
          </div>
        )}
      </div>

      {locations.map((loc) => (
        <div key={loc.id} className="mb-10 px-4 md:px-0 max-w-full overflow-hidden">
          {/* Overflow hidden here to prevent page overflow */}
          {/* <h2 className="text-xl font-semibold mb-4">{loc.name}</h2> */}
          <h2 className="flex items-center gap-2 border border-my-orangedark text-my-orangedark px-3 py-1 w-fit font-semibold text-lg mb-6 mt-8">
            <FaMapMarkerAlt className="text-my-orangedark" />
            {loc.name}
          </h2>
          {events.length === 0 ? (
            <p className="text-center text-gray-500">Ingen events at vise.</p>
          ) : (
            <div
              className="
    flex flex-col xs:flex-col md:flex-row
    overflow-auto
    snap-y xs:snap-y md:snap-x md:snap-mandatory
    space-y-4 md:space-y-0 md:space-x-4
    pb-4 scrollbar-hide scroll-smooth
    max-w-full
    -mx-4 md:mx-0
  "
              style={{ scrollPaddingTop: "1rem" }}
            >
              {events
                .filter((ev) => ev.location.id === loc.id)
                .map((ev) => (
                  <div key={ev.id} className="snap-start min-w-full md:min-w-[250px] flex-shrink-0">
                    <EventCard event={ev} showDelete onDelete={handleDeleteLocally} />
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
