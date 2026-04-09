"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative text-lg font-semibold text-my-blue focus:text-my-orange hover:text-my-orange px-4 pt-2 transition-colors">
      {children}
      {isActive && <motion.span layoutId="underline" className="absolute left-0 -bottom-1 w-full h-[2px] bg-my-orange" transition={{ duration: 0.3 }} />}
    </Link>
  );
}
