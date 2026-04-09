"use client";

import { create } from "zustand";

export const useGalleryStore = create((set) => ({
  images: [],
  loading: false,
  error: null,

  loadImages: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.storage.from("artworks").list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) {
        console.error("Fejl:", error);
        set({ loading: false, error: "Kunne ikke hente billeder." });
        return;
      }

      const imageObjects = data.map((file) => ({
        name: file.name,
        url: supabase.storage.from("artworks").getPublicUrl(file.name).data.publicUrl,
      }));

      set({ images: imageObjects, loading: false });
    } catch (err) {
      console.error("Fejl:", err);
      set({ loading: false, error: "Der opstod en fejl ved hentning af billeder." });
    }
  },

  removeImage: (filename) =>
    set((state) => ({
      images: state.images.filter((img) => img.name !== filename),
    })),
}));
