"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/lib/api";
import { deleteImage } from "@/lib/upload";
import { FaTrash } from "react-icons/fa";

export default function DeleteButton({ id, imageFilename }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm("Er du sikker på, at du vil slette?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteEvent(id);
      if (imageFilename) {
        await deleteImage(imageFilename);
      }
      alert("Event og billede slettet!");
      router.refresh(); // 🔄 Opdater siden
    } catch (e) {
      console.error("Fejl ved sletning:", e);
      alert("Kunne ikke slette event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      // 👇 Samme farve og hover som 'redigere' & 'view' knapperne
      className={`transition ${loading ? "cursor-wait opacity-60" : "hover:text-my-orangedark text-my-orangedark"}`}
      style={{ backgroundColor: "transparent", padding: 0 }}
      title="Slet event"
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-my-orangedark" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2z" />
        </svg>
      ) : (
        <FaTrash className="h-5 w-5" />
      )}
    </button>
  );
}
