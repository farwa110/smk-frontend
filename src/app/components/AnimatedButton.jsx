"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const MotionLink = motion(Link);

const AnimatedButton = ({ children, onClick, href, className = "", type = "button", disabled = false }) => {
  // const baseStyles = "bg-[#D97C2B] text-white px-6 py-2 font-sans font-regular shadow-md cursor-pointer";
  const baseStyles = "bg-[#D97C2B] text-white px-4 sm:px-6 py-2 text-sm sm:text-base font-sans font-regular shadow-md cursor-pointer";

  const animationProps = {
    whileHover: !disabled ? { scale: 1.05, backgroundColor: "#FFA04E" } : {},
    whileTap: !disabled ? { scale: 0.95 } : {},
    transition: { type: "spring", stiffness: 300 },
  };

  if (href) {
    return (
      <MotionLink href={href} className={`${baseStyles} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`} {...animationProps}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`} {...animationProps}>
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
