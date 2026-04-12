"use client";
import { useEffect, useState } from "react";
import { fetchArtworks } from "@/lib/art";
import FlipCard from "./FlipCard";
import Link from "next/link";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="space-y-3">
    <div className="w-full aspect-[3/4] bg-my-blue/10  animate-pulse" />
    <div className="h-4 w-3/4 bg-my-blue/10  animate-pulse" />
    <div className="h-3 w-1/2 bg-my-blue/10  animate-pulse" />
  </div>
);

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-my-blue/30 bg-my-blue/5">
    <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-my-blue mb-3">Ingen kunstværker endnu</h3>
    <p className="text-sm sm:text-base text-my-blue/70 max-w-md">Tilføj kunstværker til din eventopstilling for at vise dem her.</p>
  </div>
);

const EventGalleri = ({ objectNumbers = [] }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const text = ["Oplev", "kunstværkerne", "fra", "eventet:"];

  useEffect(() => {
    if (!Array.isArray(objectNumbers) || objectNumbers.length === 0) {
      setImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchArtworks(objectNumbers)
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [objectNumbers.join(",")]);

  const container = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const letter = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <motion.h2 variants={container} initial="hidden" animate="visible" className="text-xl sm:text-3xl md:text-4xl font-bold mb-12 font-playfair text-my-blue mt-40 max-[450px]:mt-20 flex flex-wrap gap-x-2 p-2 leading-relaxed">
          {text.map((word, i) => (
            <motion.span key={i} variants={letter} className="whitespace-nowrap">
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10 mb-20 p-4 md:p-6 sm:p-10 sm:gap-12">
          {loading ? (
            Array.from({ length: objectNumbers.length || 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : images.length > 0 ? (
            images.map((img, index) => (
              <Link key={index} href={`/kunstvaerker/${img.objectNumber}`}>
                <FlipCard data={img} />
              </Link>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventGalleri;

// "use client";
// import { useEffect, useState } from "react";
// import { fetchArtworks } from "@/lib/art";
// import FlipCard from "./FlipCard";
// import Link from "next/link";
// import { motion } from "framer-motion";

// const SkeletonCard = () => (
//   <div className="space-y-3">
//     {/* Image placeholder */}
//     <div className="w-full aspect-[3/4] bg-my-blue/10 rounded animate-pulse" />
//     {/* Title placeholder */}
//     <div className="h-4 w-3/4 bg-my-blue/10 rounded animate-pulse" />
//     {/* Subtitle placeholder */}
//     <div className="h-3 w-1/2 bg-my-blue/10 rounded animate-pulse" />
//   </div>
// );

// const EventGalleri = ({ objectNumbers = [] }) => {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!Array.isArray(objectNumbers) || objectNumbers.length === 0) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     fetchArtworks(objectNumbers)
//       .then(setImages)
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [objectNumbers.join(",")]);

//   const container = {
//     hidden: { opacity: 1 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
//   };

//   const letter = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 },
//   };

//   return (
//     <div>
//       <div className="max-w-6xl mx-auto">
//         <motion.h2 variants={container} initial="hidden" animate="visible" className="text-xl sm:text-3xl md:text-4xl font-bold mb-12 font-playfair text-my-blue mt-40 max-[450px]:mt-20 flex flex-wrap p-2 break-keep leading-relaxed">
//           {"Oplev kunsterne fra ".split("").map((char, i) => (
//             <motion.span key={i} variants={letter}>
//               {char === " " ? "\u00A0" : char}
//             </motion.span>
//           ))}
//           <motion.span className="whitespace-nowrap" variants={letter}>
//             {"eventet:"}
//           </motion.span>
//         </motion.h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-10 mb-20 p-4 md:p-6 sm:p-10 sm:gap-12">
//           {loading
//             ? Array.from({ length: objectNumbers.length || 3 }).map((_, i) => <SkeletonCard key={i} />)
//             : images.map((img, index) => (
//                 <Link key={index} href={`/kunstvaerker/${img.objectNumber}`}>
//                   <FlipCard data={img} />
//                 </Link>
//               ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventGalleri;
