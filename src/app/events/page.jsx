"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";

import { getAllEvents } from "@/lib/api";
import { eventsFilter } from "@/lib/eventsFilter";
import Spinner from "../components/Spinner";

import AnimatedButton from "../components/AnimatedButton";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

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

export default function EventsPage() {
  const metadata = {
    title: "Events",
    description: "Udforsk kommende events fordelt på lokationer.",
  };
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [loadingTarget, setLoadingTarget] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const allLocations = await eventsFilter();
        setLocations(allLocations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const minSkeletonTime = 500;

    const fetchEvents = async () => {
      const startTime = Date.now();

      try {
        setLoadingEvents(true);

        const allEvents = await getAllEvents();

        const sortedEvents = [...allEvents].sort((a, b) => {
          const idA = a.date || "";
          const idB = b.date || "";
          return idA.localeCompare(idB);
        });

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(minSkeletonTime - elapsed, 0);

        setTimeout(() => {
          if (!isMounted) return;
          setEvents(sortedEvents);
          setError(null);
          setLoadingEvents(false);
        }, remaining);
      } catch (err) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(minSkeletonTime - elapsed, 0);

        setTimeout(() => {
          if (!isMounted) return;
          setError(err.message || "Kunne ikke hente events.");
          setLoadingEvents(false);
        }, remaining);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
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
    }, 1200);
  };

  const eventsByLocation = useMemo(() => {
    return locations.map((loc) => ({
      ...loc,
      items: events.filter((ev) => ev.location?.id === loc.id),
    }));
  }, [locations, events]);

  const skeletonCards = Array.from({ length: 2 });

  // const showPageSkeleton = loadingEvents || loadingLocations;
  const showPageSkeleton = loadingEvents || loadingLocations;

  return (
    <div className="p-6 max-w-5xl mx-auto mb-15 max-[400px]:p-2 max-[400px]:mx-1.5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-10 gap-4">
        <motion.h1 variants={container} initial="hidden" animate="visible" className="text-3xl sm:text-4xl font-bold mb-2 font-playfair text-my-blue mt-5 flex flex-wrap">
          {heading.split("").map((char, i) => (
            <motion.span key={i} variants={letter}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {isAdmin && (
          <div className="flex gap-3 mb-2">
            <AnimatedButton onClick={() => handleNavigate("create")}>
              {loadingTarget === "create" ? (
                <span className="flex items-center gap-2">
                  <Spinner color />
                  Åbner...
                </span>
              ) : (
                "Opret Event"
              )}
            </AnimatedButton>
          </div>
        )}
      </div>

      <p className="text-gray-500 font-sans text-sm mb-8">Udforsk kommende events fordelt på lokationer.</p>

      {error && <p className="text-my-blue text-center mb-6">{error}</p>}

      {showPageSkeleton ? (
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, sectionIndex) => (
            <div key={sectionIndex} className="mb-10 px-4 md:px-0 max-w-full overflow-hidden">
              {/* Location heading skeleton */}
              <div className="h-10 w-44  border border-gray-200 bg-my-blue/10 animate-pulse mb-6" />
              {/* Cards skeleton */}
              <div className="flex flex-col md:flex-row gap-4">
                {Array.from({ length: 2 }).map((_, cardIndex) => (
                  <EventCardSkeleton key={cardIndex} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : locations.length === 0 ? (
        <div className="min-h-[320px] flex items-center justify-center">
          <div className="w-full max-w-xl bg-white shadow-sm border border-gray-200 p-10 text-center">
            <div className="text-3xl mb-4">📍</div>
            <h2 className="text-2xl font-playfair font-semibold text-my-blue mb-2">Ingen lokationer fundet</h2>
            <p className="text-gray-500 font-sans">Der er ingen eventlokationer at vise lige nu.</p>
          </div>
        </div>
      ) : (
        eventsByLocation.map((loc) => (
          <section key={loc.id} className="mb-12 px-4 md:px-0 max-w-full overflow-hidden">
            <h2 className="flex items-center gap-2 border border-my-orangedark text-my-orangedark px-3 py-1.5 w-fit font-semibold text-lg mb-6 mt-8">
              <FaMapMarkerAlt className="text-my-orangedark" />
              {loc.name}
            </h2>

            {loc.items.length === 0 ? (
              <div className="bg-white border border-gray-200 p-8 text-center min-h-[180px] flex flex-col items-center justify-center">
                <p className="text-gray-500 font-sans">Ingen events at vise for denne lokation.</p>
              </div>
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
                {loc.items.map((ev) => (
                  <div key={ev.id} className="snap-start min-w-full md:min-w-[280px] flex-shrink-0 px-4 md:px-0">
                    <EventCard event={ev} showDelete onDelete={handleDeleteLocally} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}
