"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import lightgray from "../assets/lightgray.svg";
import Image from "next/image";

const FlipCard = ({ data }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full aspect-[3/4] perspective cursor-pointer transition duration-300"
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
      onClick={() => setFlipped((prev) => !prev)} // mobile on tap
    >
      {/* <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }} className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
      
          <div className="absolute w-full h-full backface-hidden">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover shadow-xl" />
          </div>
        

      
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-my-blue shadow-xl p-4 flex flex-col justify-center items-center text-center">
        
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-my-blue/60 z-0" />

      
          <div className="relative z-10">
            <h2 className="hidden min-[420px]:block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 font-playfair text-my-white">{data.title}</h2>
            <p className="text-sm sm:text-base text-my-flipcardgray font-sans italic font-medium">{data.artist}</p>
          </div>
        </div>
      </motion.div> */}

      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }} className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {/* Front side */}

        <div className="absolute w-full h-full backface-hidden">
          {/* Artwork Image */}
          <Image src={data.image} alt={data.title} fill className="object-cover" />

          {/* SVG Frame Overlay*/}

          <Image src={lightgray} alt="Museum Frame" className="absolute inset-0 w-full h-full pointer-events-none z-10 scale-[1.05]" />
        </div>

        {/* Back side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-my-blue shadow-xl p-4 flex flex-col justify-center items-center text-center">
          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-my-blue/60 z-0" /> */}

          {/* Content */}
          <div className="relative z-10">
            <h2 className="hidden min-[420px]:block text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 font-playfair text-my-white max-[640px]:text-2xl">{data.title}</h2>
            {/* <p className="text-sm sm:text-base text-my-flipcardgray font-sans italic font-medium">{data.artist}</p> */}
            <p className="text-sm sm:text-base text-my-flipcardgray font-sans italic font-medium max-[419px]:text-xl max-[419px]:text-my-white max-[640px]:text-lg">{data.artist}</p>

            <button className="text-sm sm:text-base font-sans italic font-medium text-my-flipcardgray border-b border-my-flipcardgray hover:border-b-2 transition duration-200">læse mere om kunst</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FlipCard;
