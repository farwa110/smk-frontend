"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/lib/supabase";
import { deleteImage } from "@/lib/upload";

// forwardRef for at kunne slette fra forældre-komponenter
const BucketGallery = forwardRef((props, ref) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hent billeder fra bucket
  const loadImages = async () => {
    const { data, error } = await supabase.storage.from("artworks").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) {
      console.error("Fejl:", error);
      return;
    }

    // Gem billeder med public URL
    const imageObjects = data.map((file) => ({
      name: file.name,
      url: supabase.storage.from("artworks").getPublicUrl(file.name).data.publicUrl,
    }));
    setImages(imageObjects);
  };

  // Slet billede
  const handleDelete = async (filename) => {
    const confirmed = window.confirm(`Slet billede: ${filename}?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteImage(filename);
      // Opdater billeder efter sletning
      setImages((prev) => prev.filter((img) => img.name !== filename));
    } catch (err) {
      console.error("Fejl:", err);
      alert("Kunne ikke slette billedet.");
    } finally {
      setLoading(false);
    }
  };

  // Gør handleDelete tilgængelig for forældre via ref
  useImperativeHandle(ref, () => ({
    deleteFromGallery: handleDelete,
  }));

  // Hent billeder når komponenten mountes
  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="p-4">
      <h2>Billeder i artworks-bucket</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(({ name, url }) => (
          <div key={name} className="relative group">
            <img src={url} alt={name} className="rounded shadow w-full" />

            {/* Slet-knap uden ikoner */}
            <button onClick={() => handleDelete(name)} disabled={loading} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Slet
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

BucketGallery.displayName = "BucketGallery";
export default BucketGallery;
