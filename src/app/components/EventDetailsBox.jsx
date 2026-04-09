"use client";

import { useEffect, useState } from "react";
import EventButton from "@/app/components/EventButton";

export default function EventDetailsBox({ eventId, className }) {
  const [eventData, setEventData] = useState(null);
  const [tickets, setTickets] = useState(1);

  const fetchEvent = async () => {
    const res = await fetch(`https://async-exhibit-server-2awc.onrender.com/events/${eventId}`);
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

  if (!eventData) return <p>Loading event data...</p>;

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
        <p className="text-sm sm:text-base text-green-700 font-sans font-medium">Billetter tilbage: {ticketsLeft}</p>

        <div className="flex items-center space-x-2">
          <button onClick={handleDecrement} className="px-2 py-1 bg-[#bcc2ef] w-8 h-8 text-xl rounded">
            -
          </button>
          <span className="text-lg font-medium">{tickets}</span>
          <button onClick={handleIncrement} className="px-2 py-1 bg-[#bcc2ef] w-8 h-8 text-xl rounded">
            +
          </button>
        </div>
      </div>

      <div className="mt-6">
        <EventButton tickets={tickets} id={eventData.id} />
      </div>
    </section>
  );
}
