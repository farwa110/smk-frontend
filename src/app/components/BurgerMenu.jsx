"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";

export default function BurgerMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <button onClick={toggleMenu} className="lg:hidden flex flex-col gap-1.5 p-2">
        <span className="block w-6 h-0.5 bg-current"></span>
        <span className="block w-6 h-0.5 bg-current"></span>
        <span className="block w-6 h-0.5 bg-current"></span>
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white z-50 shadow-md px-6 py-8">
          <ul className="flex flex-col gap-6">
            {/* <li>
              <Link href="/" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                Hjem
              </Link>
            </li> */}
            <li>
              <Link href="/events" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                Event Liste
              </Link>
            </li>

            {isAdmin && (
              <li>
                <Link href="/createevents" className="font-playfair text-2xl" onClick={toggleMenu}>
                  Opret Event
                </Link>
              </li>
            )}
            <li>
              <Link href="/galleri" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                Kunstgalleri
              </Link>
            </li>
            <SignedOut>
              <li>
                <Link href="/sign-in" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                  Konto
                </Link>
              </li>
            </SignedOut>
            <SignedIn>
              <li>
                <Link href="/mediebibliotek" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                  Mediabibliotek
                </Link>
              </li>
            </SignedIn>
          </ul>
        </div>
      )}
    </>
  );
}
