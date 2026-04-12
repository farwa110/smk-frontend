"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gallerivaerk } from "@/lib/galleri";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Image from "next/image";
import { motion } from "framer-motion";

const KunstGalleri = () => {
  const [artworks, setArtworks] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const getArtworks = async () => {
      const items = await gallerivaerk();
      setArtworks(items);
    };

    getArtworks();
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  /* Typing animation effekt */

  const text = "Andre kunstværker";

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  return (
    <section className="py-4 px-2 ">
      {/* <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 font-playfair text-my-blue mt-10">Andre kunstværker</h2> */}
      <motion.h2 variants={container} initial="hidden" animate="visible" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 font-playfair text-my-blue mt-10 flex flex-wrap">
        {text.split("").map((char, i) => (
          <motion.span key={i} variants={letter}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h2>

      <div className="relative bg-my-blue pt-10 px-6 m-auto">
        {/* scroll icons */}
        <button onClick={scrollLeft} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow z-10" aria-label="Scroll left">
          <HiChevronLeft className="w-6 h-6 text-my-blue cursor-pointer" />
        </button>

        <button onClick={scrollRight} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow z-10" aria-label="Scroll right">
          <HiChevronRight className="w-6 h-6 text-my-blue cursor-pointer" />
        </button>

        {/* horizontal scrollable gallery */}

        <div ref={scrollRef} className=" pt-10 px-6 w-full flex overflow-x-auto gap-4 pb-4 scroll-smooth mb-30 scrollbar-hide ">
          {artworks.map((art, index) => (
            <Link key={art.id || index} href={`/kunstvaerker/${art.object_number}`} className=" bg-my-white min-w-[80%] sm:min-w-[300px] md:min-w-[250px] lg:min-w-[200px] flex-shrink-0 overflow-hidden shadow block mb-18 mx-3 border-[8px] border-[#807B7A]">
              <div className="relative w-full h-80 sm:h-60 sm:max-w-90">
                <Image src={art.image_thumbnail || "/dummy.webp"} alt={art.titles?.[0]?.title || "Artwork"} sizes="(max-width: 640px) 80vw, (max-width: 768px) 300px, (max-width: 1024px) 250px, 200px" fill style={{ objectFit: "cover" }} className="transition-transform duration-300 hover:scale-105" />
              </div>

              <div className="p-4 pt-4 text-sm text-my-blue font-sans italic truncate mb-4">{art.titles?.[0]?.title || "Uden titel"}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KunstGalleri;

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import Link from "next/link";
// import { gallerivaerk } from "@/lib/galleri";
// import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
// import Image from "next/image";
// import { motion } from "framer-motion";

// const KunstGalleri = ({ currentArtist = "", currentObjectNumber = "" }) => {
//   const [artworks, setArtworks] = useState([]);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     const getArtworks = async () => {
//       try {
//         const items = await gallerivaerk();
//         setArtworks(items || []);
//       } catch (error) {
//         console.error("Error fetching gallery artworks:", error);
//         setArtworks([]);
//       }
//     };

//     getArtworks();
//   }, []);

//   const filteredArtworks = useMemo(() => {
//     if (!Array.isArray(artworks)) return [];

//     return artworks.filter((art) => {
//       const artistName = art?.artist?.[0] || "";
//       const sameArtist = currentArtist && artistName.toLowerCase().trim() === currentArtist.toLowerCase().trim();

//       const notCurrentArtwork = art?.object_number !== currentObjectNumber;

//       return sameArtist && notCurrentArtwork;
//     });
//   }, [artworks, currentArtist, currentObjectNumber]);

//   const scrollLeft = () => {
//     scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
//   };

//   const headingText = filteredArtworks.length > 0 ? "Andre kunstværker af samme kunstner" : "Andre kunstværker";

//   const container = {
//     hidden: { opacity: 1 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.07,
//       },
//     },
//   };

//   const letter = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 },
//   };

//   if (!filteredArtworks.length) {
//     return (
//       <section className="py-4 px-2">
//         <motion.h2 variants={container} initial="hidden" animate="visible" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 font-playfair text-my-blue mt-10 flex flex-wrap">
//           {headingText.split("").map((char, i) => (
//             <motion.span key={i} variants={letter}>
//               {char === " " ? "\u00A0" : char}
//             </motion.span>
//           ))}
//         </motion.h2>

//         <div className="max-w-6xl mx-auto rounded-xl border border-dashed border-my-blue/30 bg-my-blue/5 px-6 py-12 text-center">
//           <h3 className="text-xl font-playfair text-my-blue mb-3">Ingen flere værker fra denne kunstner</h3>
//           <p className="text-my-blue/70 font-sans">Der blev ikke fundet andre kunstværker af samme kunstner i galleriet.</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-4 px-2">
//       <motion.h2 variants={container} initial="hidden" animate="visible" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 font-playfair text-my-blue mt-10 flex flex-wrap">
//         {headingText.split("").map((char, i) => (
//           <motion.span key={i} variants={letter}>
//             {char === " " ? "\u00A0" : char}
//           </motion.span>
//         ))}
//       </motion.h2>

//       <div className="relative bg-my-blue pt-10 px-6 m-auto">
//         <button onClick={scrollLeft} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow z-10" aria-label="Scroll left">
//           <HiChevronLeft className="w-6 h-6 text-my-blue cursor-pointer" />
//         </button>

//         <button onClick={scrollRight} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow z-10" aria-label="Scroll right">
//           <HiChevronRight className="w-6 h-6 text-my-blue cursor-pointer" />
//         </button>

//         <div ref={scrollRef} className="pt-10 px-6 w-full flex overflow-x-auto gap-4 pb-4 scroll-smooth mb-30 scrollbar-hide">
//           {filteredArtworks.map((art, index) => (
//             <Link key={art.object_number || index} href={`/kunstvaerker/${art.object_number}`} className="bg-my-white min-w-[80%] sm:min-w-[300px] md:min-w-[250px] lg:min-w-[200px] flex-shrink-0 overflow-hidden shadow block mb-18 mx-3 border-[8px] border-[#807B7A]">
//               <div className="relative w-full h-80 sm:h-60 sm:max-w-90">
//                 <Image src={art.image_thumbnail || "/dummy.webp"} alt={art.titles?.[0]?.title || "Artwork"} fill sizes="(max-width: 640px) 80vw, (max-width: 768px) 300px, (max-width: 1024px) 250px, 200px" style={{ objectFit: "cover" }} className="transition-transform duration-300 hover:scale-105" />
//               </div>

//               <div className="p-4 pt-4 text-sm text-my-blue font-sans italic truncate mb-4">{art.titles?.[0]?.title || "Uden titel"}</div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default KunstGalleri;
