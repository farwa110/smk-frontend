"use client";

import { useEffect, useState } from "react";
import SortSelector from "@/app/components/SortSelector";
import dummy from "../assets/dummy.webp";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GalleriPage() {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("artist");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("*");
  const [rows, setRows] = useState(52);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.smk.dk/api/v1/art/search/?keys=${searchQuery}&filters=[has_image:true]&offset=0&rows=${rows}`)
      .then((res) => res.json())
      .then((data) => {
        setArtworks(data.items || []);
        setError(null);
      })
      .catch(() => setError("Kunne ikke hente værker fra SMK."))
      .finally(() => setLoading(false));
  }, [searchQuery, rows]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim() || "*");
  };

  const sortedArtworks = [...artworks].sort((a, b) => {
    if (sortBy === "artist") return (a.artist_names?.[0] || "").localeCompare(b.artist_names?.[0] || "");
    if (sortBy === "title") return (a.titles?.[0]?.title || "").localeCompare(b.titles?.[0]?.title || "");
    if (sortBy === "year") return (a.production_date?.[0]?.period || "").localeCompare(b.production_date?.[0]?.period || "");
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl font-bold font-playfair text-my-blue mb-2">
          SMK Kunstværker
        </motion.h1>
        <p className="text-gray-500 font-sans text-sm">Udforsk samlingen fra Statens Museum for Kunst</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <form className="flex w-full max-w-xl" onSubmit={handleSearchSubmit}>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="flex-grow border border-gray-400 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-my-blue transition rounded-l" placeholder="Søg efter kunstværk, kunstner..." />
          <button type="submit" className="bg-my-blue text-white px-5 py-2 rounded-r hover:bg-my-orangedark transition font-sans">
            Søg
          </button>
        </form>

        <SortSelector sortBy={sortBy} onChange={setSortBy} />
      </div>

      {/* Search label */}
      <p className="text-sm text-gray-500 mb-6 font-sans">
        {searchQuery !== "*" ? (
          <>
            Søger efter: <strong>{searchQuery}</strong> — {sortedArtworks.length} resultater
          </>
        ) : (
          <>{sortedArtworks.length} kunstværker</>
        )}
      </p>

      {error && <p className="text-red-600 mb-6">{error}</p>}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-my-blue"></div>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <>
          {sortedArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedArtworks.map((item) => {
                const title = item.titles?.[0]?.title || "Ukendt titel";
                const year = item.production_date?.[0]?.period || "";
                const artist = item.artist_names?.[0] || "Ukendt kunstner";

                return (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} whileHover={{ y: -4 }} className="bg-white shadow hover:shadow-lg transition-all duration-300">
                    <Link href={`/kunstvaerker/${item.object_number}`}>
                      <div className="overflow-hidden">
                        <Image src={item.has_image && item.image_thumbnail ? item.image_thumbnail : dummy} alt={title} width={400} height={300} className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <h2 className="font-playfair text-base font-semibold text-my-blue truncate">{title}</h2>
                        <p className="text-sm text-gray-500 font-sans mt-1 truncate">{artist}</p>
                        <p className="text-xs text-my-orangedark font-sans mt-1">{year}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-20">Ingen kunstværker fundet.</p>
          )}

          {/* Load more */}
          {sortedArtworks.length >= rows && (
            <div className="flex justify-center mt-12">
              <button onClick={() => setRows(rows + 12)} className="bg-my-blue text-white px-8 py-3 hover:bg-my-orangedark transition font-sans text-sm">
                Se flere kunstværker
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
