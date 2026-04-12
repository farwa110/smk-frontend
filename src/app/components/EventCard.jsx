"use client";

import { useUser } from "@clerk/nextjs";
import DeleteButton from "./Deletebutton";
import ChangeEventsButton from "./ChangeEventsButton";
import AnimatedButton from "./AnimatedButton";
import { motion } from "framer-motion";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dummy from "../assets/dummy.webp";

export default function EventCard({ event, onDelete }) {
  if (!event) return <p>Fejl: Event mangler.</p>;

  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [viewLoading, setViewLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageSrc = imgError || !event.imageUrl ? dummy.src : event.imageUrl;

  const handleViewClick = () => {
    setViewLoading(true);
    setTimeout(() => {
      router.push(`/events/${event.id}`);
    }, 500);
  };

  return (
    <div className="p-4 bg-white/80 flex-grow h-full w-full max-w-[700px] min-w-[250px] flex-shrink-0 overflow-hidden shadow block mb-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full mx-auto p-4 sm:p-6 md:p-8 border border-my-bluedark/20 bg-gradient-to-br from-white/70 to-my-bluelight/40 shadow-md backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-60">
          {/* ✅ regular img tag — works with any URL including Supabase */}
          <img src={imageSrc} alt={event.title} onError={() => setImgError(true)} className="w-full max-w-full md:w-60 h-auto object-cover" />

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-playfair text-my-blue py-2 sm:py-3">{event.title}</h2>
              <p className="text-sm sm:text-base font-sans text-my-blue py-2 sm:py-3">{event.description}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-sans font-bold text-my-orangedark py-1.5 sm:py-2.5">Dato: {event.date}</p>
              <p className="text-xs sm:text-sm font-sans font-bold text-my-orangedark">Lokation: {event.location?.name || "Ukendt"}</p>
            </div>
          </div>
        </div>

        {/* Knapper */}
        <div className="mt-6 pt-4 border-t border-my-orangedark/20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          {/* ✅ only show delete/edit for admin */}
          {isAdmin && (
            <div className="flex gap-2 justify-start">
              <DeleteButton id={event.id} imageFilename={event.imageFilename} onDeleted={() => onDelete?.(event.id)} />
              <ChangeEventsButton id={event.id} />
            </div>
          )}

          <div className="font-sans mt-4 sm:mt-0 flex justify-start sm:justify-end">
            <AnimatedButton onClick={handleViewClick} disabled={viewLoading} className="flex items-center gap-2">
              {viewLoading ? (
                <>
                  <Spinner color="white" /> Event loading.....
                </>
              ) : (
                "Se Event"
              )}
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
