"use client";

import { useEffect, useMemo, useState } from "react";
import SortSelector from "@/app/components/SortSelector";
import dummy from "../assets/dummy.webp";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import crownColored from "../assets/crown_colored.png";

const PERIODS = [
  { label: "Alle", from: null, to: null },
  { label: "Middelalderen", from: 500, to: 1400 },
  { label: "Renæssance", from: 1400, to: 1600 },
  { label: "Barok", from: 1600, to: 1750 },
  { label: "Klassicisme", from: 1750, to: 1850 },
  { label: "Romantik", from: 1800, to: 1870 },
  { label: "Realisme", from: 1840, to: 1880 },
  { label: "Det Moderne Gennembrud", from: 1870, to: 1890 },
  { label: "Modernisme", from: 1900, to: 1970 },
  { label: "Samtidskunst", from: 1970, to: 2100 },
];

export default function GalleriPage() {
  const metadata = {
    title: "Kunstgalleri",
    description: "Udforsk SMK's kunstsamling fra Statens Museum for Kunst.",
  };
  const [loading, setLoading] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [activePeriod, setActivePeriod] = useState(PERIODS[0]);
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("artist");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("*");
  const [rows, setRows] = useState(52);

  useEffect(() => {
    let isMounted = true;
    const minSkeletonTime = 500;

    setLoading(true);
    setShowSkeleton(true);

    const fetchRows = activePeriod.from !== null ? 500 : rows;

    const url = `https://api.smk.dk/api/v1/art/search/?keys=${encodeURIComponent(searchQuery)}&filters=[has_image:true]&offset=0&rows=${fetchRows}`;

    const startTime = Date.now();

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;

        let items = data.items || [];

        if (activePeriod.from !== null) {
          items = items.filter((item) => {
            const ranges = item.production_date || [];

            return ranges.some((date) => {
              const start = date.start ? new Date(date.start).getFullYear() : null;
              const end = date.end ? new Date(date.end).getFullYear() : start;

              if (!start && !end) return false;

              const itemStart = start ?? end;
              const itemEnd = end ?? start;

              return itemEnd >= activePeriod.from && itemStart <= activePeriod.to;
            });
          });
        }

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(minSkeletonTime - elapsed, 0);

        setTimeout(() => {
          if (!isMounted) return;
          setArtworks(items);
          setError(null);
          setLoading(false);
          setShowSkeleton(false);
        }, remaining);
      })
      .catch((err) => {
        console.error(err);

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(minSkeletonTime - elapsed, 0);

        setTimeout(() => {
          if (!isMounted) return;
          setError("Kunne ikke hente værker fra SMK.");
          setArtworks([]);
          setLoading(false);
          setShowSkeleton(false);
        }, remaining);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, rows, activePeriod]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActivePeriod(PERIODS[0]);
    setRows(52);
    setSearchQuery(searchInput.trim() || "*");
  };

  const handlePeriodClick = (period) => {
    setActivePeriod(period);
    setRows(52);
    setSearchInput("");
    setSearchQuery("*");
  };

  const sortedArtworks = [...artworks].sort((a, b) => {
    const yearA = a.production_date?.[0]?.start ? new Date(a.production_date[0].start).getFullYear() : 9999;

    const yearB = b.production_date?.[0]?.start ? new Date(b.production_date[0].start).getFullYear() : 9999;

    if (sortBy === "artist") {
      return (a.artist?.[0] || "").localeCompare(b.artist?.[0] || "");
    }

    if (sortBy === "title") {
      return (a.titles?.[0]?.title || "").localeCompare(b.titles?.[0]?.title || "");
    }

    if (sortBy === "year-asc") {
      return yearA - yearB;
    }

    if (sortBy === "year-desc") {
      return yearB - yearA;
    }

    return 0;
  });

  const skeletonCards = Array.from({ length: 9 });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl font-bold font-playfair text-my-blue mb-2">
          SMK Kunstværker
        </motion.h1>
        <p className="text-gray-500 font-sans text-sm">Udforsk samlingen fra Statens Museum for Kunst</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <form className="flex w-full max-w-xl" onSubmit={handleSearchSubmit}>
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="flex-grow border border-gray-400 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-my-blue transition" placeholder="Søg efter kunstværk, kunstner..." />
          <button type="submit" className="bg-my-blue text-white px-5 py-2  hover:bg-my-blue/80 transition font-sans">
            Søg
          </button>
        </form>
        <SortSelector sortBy={sortBy} onChange={setSortBy} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-48 shrink-0">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-sans mb-3">Tidsperiode</p>

          <ul className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:pb-0">
            {PERIODS.map((period) => (
              <li key={period.label} className="shrink-0 lg:shrink">
                <button onClick={() => handlePeriodClick(period)} className={`w-full min-w-[140px] lg:min-w-0 text-left px-3 py-2  text-sm font-sans transition ${activePeriod.label === period.label ? "bg-my-blue text-white font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-my-blue"}`}>
                  {period.label}
                  {period.from && (
                    <span className={`block text-xs mt-0.5 ${activePeriod.label === period.label ? "text-blue-200" : "text-gray-400"}`}>
                      {period.from} – {period.to === 2100 ? "nu" : period.to}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 min-w-0 min-h-[500px]">
          <p className="text-sm text-gray-500 mb-6 font-sans">
            {showSkeleton ? (
              <>Henter kunstværker...</>
            ) : activePeriod.from !== null ? (
              <>
                <strong>{activePeriod.label}</strong> ({activePeriod.from}–{activePeriod.to === 2100 ? "nu" : activePeriod.to}) — {sortedArtworks.length} resultater
              </>
            ) : searchQuery !== "*" ? (
              <>
                Søger efter: <strong>{searchQuery}</strong> — {sortedArtworks.length} resultater
              </>
            ) : (
              <>{sortedArtworks.length} kunstværker</>
            )}
          </p>

          {error && <p className="text-red-600 mb-6">{error}</p>}

          {showSkeleton ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skeletonCards.map((_, index) => (
                <div key={index} className=" overflow-hidden border border-gray-100">
                  <div className="w-full h-52 bg-my-blue/10 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5  bg-my-blue/10 animate-pulse w-3/4" />
                    <div className="h-4  bg-my-blue/10 animate-pulse w-1/2" />
                    <div className="h-4  bg-my-blue/10 animate-pulse w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedArtworks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedArtworks.map((item) => {
                  const title = item.titles?.[0]?.title || "Ukendt titel";
                  const year = item.production_date?.[0]?.period || "";
                  const artist = item.artist?.[0] || "Ukendt kunstner";

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

              {sortedArtworks.length >= rows && (
                <div className="flex justify-center mt-12">
                  <button onClick={() => setRows(rows + 12)} className="bg-my-blue text-white px-8 py-3 hover:bg-my-orangedark transition font-sans text-sm">
                    Se flere kunstværker
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[420px]">
              <div className="col-span-full flex items-center justify-center">
                <div className="w-full max-w-lg bg-white shadow-sm border border-gray-200  p-10 text-center">
                  {/* <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                    <Img src={crownColored} alt="Ingen resultater" className="w-8 h-8 object-cover" />
                  </div> */}
                  <div className=" mx-auto mb-4  flex items-center justify-center">
                    <Image src={crownColored} alt="Crown" width={32} height={32} className="object-contain" />
                  </div>
                  <h3 className="text-xl font-semibold text-my-blue font-playfair mb-2">Ingen kunstværker fundet</h3>

                  <p className="text-sm text-gray-500 font-sans mb-6">Prøv en anden søgning eller vælg en anden tidsperiode for at se flere værker.</p>

                  <button
                    onClick={() => {
                      setActivePeriod(PERIODS[0]);
                      setSearchInput("");
                      setSearchQuery("*");
                      setRows(52);
                    }}
                    className="bg-my-blue text-white px-6 py-3  hover:bg-my-blue/80 transition font-sans text-sm"
                  >
                    Nulstil filtre
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
