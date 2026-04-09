"use client";
import React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllEvents, updateEvent } from "@/lib/api";
import BackButton from "../../components/BackButton";
import KunstListe from "@/app/components/KunstListe";
import AnimatedButton from "../../components/AnimatedButton";
import dummy from "@/app/assets/dummy.webp";
import { uploadImage, deleteImage } from "@/lib/upload";

// Validering af felter
const eventSchema = z.object({
  title: z.string().min(1, "Titel er påkrævet"),
  description: z.string().min(1, "Beskrivelse er påkrævet"),
  date: z.string().min(1, "Dato er påkrævet"),
  locationId: z.string().optional(),
  curator: z.string().optional(),
});

export default function ChangeEventPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();

  // States
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [imgSrc, setImgSrc] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState(null);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      locationId: "",
      curator: "",
    },
  });

  // Hent event og data
  useEffect(() => {
    const loadData = async () => {
      try {
        const events = await getAllEvents();
        const found = events.find((e) => e.id === id);
        if (!found) throw new Error("Event ikke fundet.");

        // Udfyld formular med eksisterende data
        setValue("title", found.title);
        setValue("description", found.description);
        setValue("date", found.date);
        setValue("locationId", found.location?.id || "");
        setValue("curator", found.curator || "");

        // Find unikke datoer og lokationer
        setAvailableDates([...new Set(events.map((e) => e.date))]);
        setLocations(events.map((e) => e.location).filter((loc, i, self) => loc && i === self.findIndex((l) => l.id === loc.id)));

        // Billede og kunstværker
        setImgSrc(found.imageUrl || dummy.src);
        setUploadedImageUrl(found.imageUrl || null);
        setUploadedImageName(found.imageUrl?.split("/").pop() || null);

        // Hent SMK-kunstværker
        const artworkIds = found.artworkIds || [];
        const responses = await Promise.all(
          artworkIds.map(async (artId) => {
            const artIdWithoutExt = artId.replace(/\.(png|jpg|jpeg|webp)$/i, "");
            const res = await fetch(`https://api.smk.dk/api/v1/art/search/?keys=${artIdWithoutExt}&object_number=${artIdWithoutExt}`);
            const data = await res.json();
            const item = data.items?.[0];
            if (item) {
              return {
                id: artIdWithoutExt,
                title: item.titles?.[0]?.title || artIdWithoutExt,
                image: item.image_thumbnail || dummy.src,
              };
            }
            return { id: artIdWithoutExt, title: artIdWithoutExt, image: dummy.src };
          })
        );
        setArtworks(responses);
      } catch (err) {
        console.error("Fejl:", err);
        setError(err.message);
      }
    };

    loadData();
  }, [id, setValue]);

  // Upload billede
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (uploadedImageName) {
        await deleteImage(uploadedImageName);
      }
      const url = await uploadImage(file);
      setUploadedImageUrl(url);
      setUploadedImageName(file.name);
      setImgSrc(url);
      e.target.value = "";
    } catch (err) {
      console.error("Fejl ved upload:", err);
      setError("Upload fejlede: " + (err.message || JSON.stringify(err)));
    }
  };

  // Slet billede
  const handleDeleteImage = async () => {
    try {
      if (uploadedImageName) {
        await deleteImage(uploadedImageName);
        setUploadedImageUrl(null);
        setUploadedImageName(null);
        setImgSrc(dummy.src);

        // Fjern fra artworks
        const cleanId = uploadedImageName.replace(/\.(png|jpg|jpeg|webp)$/i, "");
        setArtworks((prev) => prev.filter((art) => art.id !== cleanId));
      }
    } catch (err) {
      console.error("Fejl ved sletning:", err);
    }
  };

  // Tilføj kunstværk
  const handleAddArtwork = (artwork) => {
    if (!artworks.find((a) => a.id === artwork.id)) {
      setArtworks([...artworks, artwork]);
    }
  };

  // Fjern kunstværk
  const handleRemoveArtwork = (removeId) => {
    setArtworks(artworks.filter((a) => a.id !== removeId));
  };

  // Gem ændringer
  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await updateEvent(id, {
        ...data,
        artworkIds: [...(uploadedImageName ? [uploadedImageName] : []), ...artworks.filter((a) => a.id !== uploadedImageName).map((a) => a.id)],
      });
      alert("Event opdateret!");
      router.push("/events");
    } catch (err) {
      console.error("Fejl:", err);
      setError("Kunne ikke opdatere eventet: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-600 p-4">{error}</p>;

  return (
    <div>
      {/* Tilbage-knap */}
      <div className="cursor-pointer hover:opacity-80 transition font-sans font-semibold">
        <BackButton />
      </div>

      {/* Formular */}
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow mt-6">
        <h2 className="text-xl md:text-2xl font-bold mb-8 font-playfair text-my-blue">Rediger Event</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-my-blue">
          <input {...register("title")} placeholder="Titel" className="block w-full p-2 border text-my-blue font-sans" />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}

          <div className="flex gap-4">
            <div className="w-1/2">
              <select {...register("date")} className="block w-full p-2 border text-my-blue font-sans">
                <option value="">Vælg dato</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
            </div>

            <div className="w-1/2">
              <select {...register("locationId")} className="block w-full p-2 border text-my-blue font-sans">
                <option value="">Vælg lokation</option>
                {locations.map((loc) => (
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

          {/* Viste kunstværker uden ikoner */}
          <div>
            <label className="block font-sans text-gray-600">Valgte kunstværker:</label>
            <div className="flex flex-wrap gap-4">
              {artworks
                .filter((a) => a.id !== uploadedImageName?.replace(/\.(png|jpg|jpeg|webp)$/i, ""))
                .map((art) => (
                  <div key={art.id} className="relative p-2 bg-gray-100 border max-w-[120px] group">
                    {/* Enkel tekst-knap i stedet for ✕ */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveArtwork(art.id);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded transition"
                    >
                      Fjern
                    </button>
                    <img src={art.image} alt={art.title} className="w-full h-auto mb-1 rounded" />
                    <p className="text-xs font-medium break-words">{art.title}</p>
                  </div>
                ))}
            </div>
          </div>

          <AnimatedButton type="submit" disabled={loading}>
            {loading ? "Gemmer..." : "Gem ændringer"}
          </AnimatedButton>
        </form>
      </div>

      {/* Kunstværks-liste */}
      <div className="w-full px-6">
        <KunstListe onAddArtwork={handleAddArtwork} onRemoveArtwork={handleRemoveArtwork} selectedArtworks={artworks.map((a) => a.id)} />
      </div>
    </div>
  );
}
