import React from "react";
import EventDetailsBox from "@/app/components/EventDetailsBox";
import EventBilledeBox from "@/app/components/EventBilledeBox";
import EventGalleri from "@/app/components/EventGalleri";
import BackButton from "@/app/components/BackButton";

export default async function Page({ params }) {
  const { id } = await params; // params er allerede et objekt

  const response = await fetch(`https://smk-backend-f1ia.onrender.com/events/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // cache: 'no-store', // hvis du vil sikre frisk data
  });

  if (!response.ok) {
    // Håndter fejl fx returner en fejlside eller lign.
    throw new Error("Failed to fetch event data");
  }

  const data = await response.json();

  return (
    <div>
      <div className="cursor-pointer hover:opacity-80 transition font-sans font-semibold mb-15 mt-8 pr-2">
        <BackButton />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-15 lg:gap-20 mt-4 mb-6 max-w-6xl mx-auto">
        <div className="w-full lg:w-3/5 mb-6 lg:mb-0">
          <EventBilledeBox imageUrl={data.imageUrl} />
        </div>

        <div className="w-full lg:w-2/5">
          <EventDetailsBox eventId={data.id} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 px-0">
        <EventGalleri objectNumbers={data.artworkIds} />
      </div>
    </div>
  );
}
