"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import image from "../assets/heropic.webp";
import AnimatedButton from "./AnimatedButton";

const headingWords = ["STATENS", "MUSEUM", "FOR", "KUNST"];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // tid mellem enkelt ord
      delayChildren: 0.2,
    },
  },
};

const wordContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04, //tid mellem enkelt ord
    },
  },
};

const letterAnimation = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const HeroSection = () => {
  return (
    <section className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center items-start px-8 py-16 space-y-6">
        <motion.h1 className="text-4xl sm:text-6xl font-extrabold font-playfair leading-tight text-[#2B346B]" variants={container} initial="hidden" animate="visible">
          {headingWords.map((word, wordIndex) => (
            <motion.span key={wordIndex} variants={wordContainer} className="inline-block mr-2">
              {word.split("").map((char, charIndex) => (
                <motion.span key={charIndex} variants={letterAnimation} className="inline-block">
                  {char}
                </motion.span>
              ))}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h2 className="text-lg sm:text-xl font-sans text-my-blue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}>
          Vi bevarer og formidler historien gennem kunst og kultur
        </motion.h2>

        {/* <AnimatedButton className="mt-2.5">See events</AnimatedButton> */}
        <Link href="/events">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}>
            <AnimatedButton className="mt-2.5 font-sans">See events</AnimatedButton>
          </motion.div>
        </Link>
      </div>

      <motion.div className="relative w-full h-[400px] md:h-auto overflow-hidden" initial={{ clipPath: "inset(0% 100% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}>
        <Image src={image} alt="Hero" fill className="object-contain md:object-cover" priority />
      </motion.div>
    </section>
  );
};

export default HeroSection;
