"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./Spinner";

export default function CreateEventButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    // Vent 1.5 sekunder før navigation
    setTimeout(() => {
      router.push("/createevents");
    }, 100);
  };

  return (
    <button onClick={handleClick} disabled={loading} className="flex items-center gap-2 px-4 py-2  hover:text-[#FFA04E] text-my-orangedark disabled:opacity-50">
      {loading ? <Spinner /> : "Opret Event"}
    </button>
  );
}
