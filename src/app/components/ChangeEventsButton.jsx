"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import Spinner from "./Spinner";

export default function ChangeEventButton({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!id) return null;

  const handleClick = () => {
    setLoading(true);

    // Small delay to show spinner
    setTimeout(() => {
      router.push(`/changeevent/${id}`);
    }, 100);
  };

  return (
    <button onClick={handleClick} disabled={loading} className="p-2 hover:text-[#FFA04E] text-my-orangedark transition disabled:opacity-50">
      {loading ? <Spinner /> : <FaEdit className="h-5 w-5" />}
    </button>
  );
}
