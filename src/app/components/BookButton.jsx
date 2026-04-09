"use client";

import { useState } from "react";
import { bookEvent } from "@/lib/api";

export default function BookButton({ id }) {
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);

    try {
      await bookEvent(id, { quantity: booked ? -1 : 1 });

      // Sikrer at spinner vises i mindst 1.5 sekunder
      await new Promise((res) => setTimeout(res, 100));

      setBooked(!booked);
    } catch (err) {
      alert("❌ Der opstod en fejl ved booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={loading} className={`px-4 py-2 flex items-center justify-center gap-2 rounded text-white transition ${booked ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"} ${loading ? "cursor-wait opacity-80" : ""}`}>
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
            <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z" />
          </svg>
          Vent...
        </>
      ) : booked ? (
        "Annuller booking ❌"
      ) : (
        "Book"
      )}
    </button>
  );
}
