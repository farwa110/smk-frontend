"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { supabase } from "@/lib/supabase";
import { deleteImage } from "@/lib/upload";
import { MdOutlinePermMedia } from "react-icons/md";

const BucketGallery = forwardRef((props, ref) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from("artworks").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) {
      console.error("Fejl:", error);
      setLoading(false);
      return;
    }
    const imageObjects = data.map((file) => ({
      name: file.name,
      url: supabase.storage.from("artworks").getPublicUrl(file.name).data.publicUrl,
    }));
    setImages(imageObjects);
    setLoading(false);
  };

  const handleDelete = async (filename) => {
    const confirmed = window.confirm(`Slet billede: ${filename}?`);
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteImage(filename);
      setImages((prev) => prev.filter((img) => img.name !== filename));
    } catch (err) {
      console.error("Fejl:", err);
      alert("Kunne ikke slette billedet.");
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    deleteFromGallery: handleDelete,
  }));

  useEffect(() => {
    loadImages();
  }, []);

  // ── Skeleton ─────────────────────────────────────────────
  if (loading)
    return (
      <div className="p-4">
        <div className="h-7 w-48 bg-my-blue/10  animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-my-blue/10 animate-pulse" />
          ))}
        </div>
      </div>
    );

  // ── Empty state ───────────────────────────────────────────
  if (images.length === 0)
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold text-my-blue mb-6">Billeder i State kunst museum`s Bucket</h2>
        <div className="min-h-[320px] flex items-center justify-center">
          <div className="text-center bg-white border border-gray-200  p-10 max-w-sm w-full shadow-sm">
            <MdOutlinePermMedia className="w-14 h-14 mx-auto mb-4  bg-gray-100 flex items-center justify-center text-2xl" />
            <h3 className="text-lg font-semibold text-my-blue font-playfair mb-2">Ingen billeder endnu</h3>
            <p className="text-sm text-gray-500 font-sans">Upload billeder via opret eller rediger event.</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-my-blue mb-4">Billeder i artworks-bucket</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(({ name, url }) => (
          <div key={name} className="relative group">
            <img src={url} alt={name} className=" shadow w-full aspect-square object-cover" />
            <button onClick={() => handleDelete(name)} disabled={loading} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1  opacity-0 group-hover:opacity-100 transition disabled:opacity-50">
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
