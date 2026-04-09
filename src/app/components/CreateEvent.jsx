"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import BackButton from "./BackButton";
import KunstListe from "./KunstListe";
import AnimatedButton from "./AnimatedButton";
import Spinner from "./Spinner";
import { uploadImage, deleteImage } from "@/lib/upload";

// Valideringsschema
const eventSchema = z.object({
  title: z.string().min(1, "Titel er påkrævet"),
  date: z.string().min(1, "Dato er påkrævet"),
  locationId: z.string().optional(),
  curator: z.string().optional(),
  description: z.string().min(1, "Beskrivelse er påkrævet"),
});

export default function CreateEvent({ date, locations }) {
  const router = useRouter();

  // States
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      locationId: "",
      curator: "",
      description: "",
    },
  });

  // Tilføj kunstværk
  const handleAddArtwork = (artwork) => {
    if (!artworks.find((a) => a.id === artwork.id)) {
      setArtworks([...artworks, artwork]);
    }
  };

  // Fjern enkelt kunstværk
  const handleRemoveArtwork = (id) => {
    setArtworks(artworks.filter((a) => a.id !== id));
  };

  // Slet alle kunstværker
  const handleClearAllArtworks = () => {
    setArtworks([]);
  };

  // Upload billede
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorMessage(null);
    try {
      const url = await uploadImage(file);
      setUploadedImageUrl(url);
      setUploadedImageName(file.name);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Fejl ved upload af billede.");
    }
  };

  // Slet billede
  const handleDeleteImage = async () => {
    try {
      if (uploadedImageName) {
        await deleteImage(uploadedImageName);
        setUploadedImageUrl(null);
        setUploadedImageName(null);
      }
    } catch (err) {
      alert("Kunne ikke slette billede");
    }
  };

  // Gem event
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(null);

    const artworkFileNames = uploadedImageName ? [uploadedImageName, ...artworks.map((a) => a.id)] : artworks.map((a) => a.id);

    const dataToSend = {
      ...data,
      artworkIds: artworkFileNames,
      imageUrl: uploadedImageUrl || null,
    };

    try {
      const response = await fetch("https://async-exhibit-server-2awc.onrender.com/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Event blev oprettet!");
        reset();
        setArtworks([]);
        setUploadedImageUrl(null);
        setUploadedImageName(null);
        router.push("/events");
      } else {
        const errorText = await response.text();
        console.error("Fejl fra server:", errorText);
        setErrorMessage("Event blev ikke oprettet. Server svarede med fejl.");
      }
    } catch (error) {
      console.error("Fejl under oprettelse:", error);
      setErrorMessage("Fejl under oprettelse af event.");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Tilbage-knap */}
      <div className="cursor-pointer hover:opacity-80 transition font-sans font-semibold">
        <BackButton />
      </div>

      {/* Formular */}
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow mt-6">
        <h2 className="text-xl md:text-2xl font-bold mb-8 font-playfair text-my-blue">Opret Nyt Event</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-my-blue">
          <input {...register("title")} placeholder="Titel" className="block w-full p-2 border text-my-blue font-sans" />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}

          <div className="flex gap-4">
            <div className="w-1/2">
              <select {...register("date")} className="block w-full p-2 border text-my-blue font-sans">
                <option value="">Vælg dato</option>
                {date?.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
            </div>

            <div className="w-1/2">
              <select {...register("locationId")} className="block w-full p-2 border text-my-blue font-sans">
                <option value="">Vælg lokation</option>
                {locations?.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <input {...register("curator")} placeholder="Kurator" className="block w-full p-2 border text-my-blue font-sans" />
          <textarea {...register("description")} placeholder="Beskrivelse" className="block w-full p-2 border text-my-blue font-sans" />
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}

          {/* Billede upload */}
          <div>
            <label className="block font-sans text-gray-600">Upload billede:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploadedImageUrl && (
              <div className="mt-2">
                <img src={uploadedImageUrl} alt="Uploaded" className="w-32 rounded" />
                <button type="button" onClick={handleDeleteImage} className="mt-1 text-sm text-red-600 underline">
                  Slet billede
                </button>
              </div>
            )}
          </div>

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          {/* Viste kunstværker uden ikoner */}
          <div>
            <label className="block font-sans text-gray-600">Valgte kunstværker:</label>
            <div className="flex flex-wrap gap-4">
              {artworks.map((art) => (
                <div key={art.id} className="relative p-2 bg-gray-100 border max-w-[120px] group">
                  {/* Fjern-knap uden ikoner */}
                  <button onClick={() => handleRemoveArtwork(art.id)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded transition" title="Fjern">
                    Fjern
                  </button>
                  <img src={art.image} alt={art.title} className="w-full h-auto mb-1 rounded" />
                  <p className="text-xs font-medium break-words">{art.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Knapper */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <AnimatedButton type="submit" disabled={loading} className={`${loading ? "cursor-wait opacity-70" : "hover:bg-[#FFA04E]"} flex items-center justify-center gap-2 w-full sm:w-auto`}>
              {loading ? (
                <>
                  <Spinner /> Opretter...
                </>
              ) : (
                <>Opret Event</>
              )}
            </AnimatedButton>

            <AnimatedButton type="button" onClick={handleClearAllArtworks} disabled={artworks.length === 0} className={`text-my-orangedark border border-[#D97C2B] hover:bg-[#D97C2B] flex items-center justify-center gap-2 w-full sm:w-auto ${artworks.length === 0 ? "opacity-50 cursor-not-allowed hover:bg-white hover:text-[#D97C2B]" : ""}`}>
              Ryd alle værker
            </AnimatedButton>
          </div>
        </form>
      </div>

      {/* Kunstværk-liste */}
      <div className="w-full px-6">
        <KunstListe onAddArtwork={handleAddArtwork} onRemoveArtwork={handleRemoveArtwork} selectedArtworks={artworks.map((a) => a.id)} />
      </div>
    </div>
  );
}
