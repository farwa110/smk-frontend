"use client";

import { useEffect, useState } from "react";
import EventButton from "@/app/components/EventButton";

export default function EventDetailsBox({ eventId, className }) {
  const [eventData, setEventData] = useState(null);
  const [tickets, setTickets] = useState(0);

  const fetchEvent = async () => {
    const res = await fetch(`https://smk-backend-f1ia.onrender.com/events/${eventId}`);
    const data = await res.json();
    setEventData(data);
  };

  useEffect(() => {
    fetchEvent(); // Fetch on initial load

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchEvent();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // if (!eventData) return <p>Loading event data...</p>;
  if (!eventData)
    return (
      <section className={`w-full max-w-2xl mx-auto space-y-4 px-4 ${className}`}>
        {/* Title */}
        <div className="h-8 w-2/3 bg-my-blue/10 rounded animate-pulse" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-my-blue/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-my-blue/10 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-my-blue/10 rounded animate-pulse" />
        </div>

        {/* Kurator / Dato / Lokation */}
        <div className="space-y-2">
          <div className="h-4 w-1/2 bg-my-blue/10 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-my-blue/10 rounded animate-pulse" />
          <div className="h-4 w-2/5 bg-my-blue/10 rounded animate-pulse" />
        </div>

        {/* Tickets row */}
        <div className="flex justify-between items-center mt-4">
          <div className="h-4 w-1/4 bg-my-blue/10 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-my-blue/10 rounded animate-pulse" />
            <div className="h-8 w-6 bg-my-blue/10 rounded animate-pulse" />
            <div className="h-8 w-8 bg-my-blue/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Button */}
        <div className="h-11 w-full bg-my-blue/10 rounded animate-pulse mt-6" />
      </section>
    );

  const { title, description, date, curator, totalTickets, bookedTickets, location } = eventData;
  const ticketsLeft = totalTickets - bookedTickets;

  const handleIncrement = () => {
    if (tickets < ticketsLeft) setTickets(tickets + 1);
  };

  const handleDecrement = () => {
    if (tickets > 1) setTickets(tickets - 1);
  };

  return (
    <section className={`w-full max-w-2xl mx-auto space-y-4 px-4 ${className}`}>
      <h1 className="text-2xl sm:text-3xl font-bold text-my-blue font-playfair">{title}</h1>

      <p className="font-sans font-normal text-my-blue leading-relaxed text-sm sm:text-base md:text-lg">{description}</p>

      <div className="space-y-1 text-sm sm:text-base md:text-lg text-my-blue">
        <p>
          <strong className="font-playfair pr-1.5">Kurator:</strong>
          <span className="font-sans">{curator}</span>
        </p>
        <p>
          <strong className="font-playfair pr-1.5">Dato:</strong>
          <span className="font-sans">{new Date(date).toLocaleDateString("da-DK")}</span>
        </p>
        <p>
          <strong className="font-playfair pr-1.5">Lokation:</strong>
          <span className="font-sans">
            {location?.name}, {location?.address}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-y-4 mt-4">
        <p className="text-sm sm:text-base font-sans font-medium">{ticketsLeft === 0 ? <span className="text-red-500">Ingen billetter tilbage</span> : <span className="text-green-700">Billetter tilbage: {ticketsLeft}</span>}</p>

        {ticketsLeft > 0 && (
          <div className="flex items-center space-x-2">
            <button onClick={handleDecrement} disabled={tickets <= 0} className="px-2 py-1 bg-[#bcc2ef] w-8 h-8 text-xl rounded disabled:opacity-40">
              -
            </button>
            <span className="text-lg font-medium">{tickets}</span>
            <button onClick={handleIncrement} disabled={tickets >= ticketsLeft} className="px-2 py-1 bg-[#bcc2ef] w-8 h-8 text-xl rounded disabled:opacity-40">
              +
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        {ticketsLeft === 0 ? (
          <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed font-sans">
            Udsolgt
          </button>
        ) : (
          <EventButton tickets={tickets} id={eventData.id} disabled={tickets === 0} />
        )}
      </div>
    </section>
  );
}
