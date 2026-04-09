"use client";
import { useEffect, useState } from "react";
import { fetchArtworks } from "@/lib/art";
import FlipCard from "./FlipCard";
import Link from "next/link";
import { motion } from "framer-motion";

const EventGalleri = ({ objectNumbers = [] }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!Array.isArray(objectNumbers) || objectNumbers.length === 0) return;

    fetchArtworks(objectNumbers).then(setImages).catch(console.error);
  }, [objectNumbers.join(",")]);

  /* Typing animation effekt */
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
    <div>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-xl sm:text-3xl md:text-4xl font-bold mb-12 font-playfair text-my-blue mt-40 max-[450px]:mt-20
flex flex-wrap p-2 break-keep leading-relaxed"
        >
          {"Oplev kunsterne fra ".split("").map((char, i) => (
            <motion.span key={i} variants={letter}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          <motion.span className="whitespace-nowrap" variants={letter}>
            {"eventet:"}
          </motion.span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10 mb-20 p-4 md:p-6 sm:p-10 sm:gap-12">
          {images.map((img, index) => (
            <Link key={index} href={`/kunstvaerker/${img.objectNumber}`}>
              <FlipCard data={img} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventGalleri;
