"use client";

import { useRef } from "react";
import BucketGallery from "../components/BucketGallery";

export default function Dashboard() {
  // Ref til BucketGallery for at kunne kalde deleteFromGallery
  const bucketGalleryRef = useRef(null);

  // Funktion til at slette billede (kalder BucketGallery via ref)
  const handleDeleteFromGallery = (filename) => {
    if (bucketGalleryRef.current) {
      bucketGalleryRef.current.deleteFromGallery(filename);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <BucketGallery ref={bucketGalleryRef} />
    </div>
  );
}
