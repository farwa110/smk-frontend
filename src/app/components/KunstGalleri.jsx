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
                <Image
                  src={art.image_thumbnail || "/dummy.webp"}
                  alt={art.titles?.[0]?.title || "Artwork"}
                  // width={300}
                  // height={600}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
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
