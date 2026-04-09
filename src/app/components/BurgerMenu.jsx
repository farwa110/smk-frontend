// "use client";

// import { useState } from "react";
// import { FaTimes } from "react-icons/fa";
// import { AiOutlineAlignRight } from "react-icons/ai";
// import Link from "next/link";
// import { UserButton } from "@clerk/nextjs";

// const BurgerMenu = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Funcktion til toggle menu
//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <>
//       {/* Burger Ikon kun for mobil skærm */}
//       <div className="lg:hidden cursor-pointer" onClick={toggleMenu}>
//         <FaTimes size={30} className={`${isMenuOpen ? "block" : "hidden"} text-my-blue`} />
//         <AiOutlineAlignRight size={30} className={`${isMenuOpen ? "hidden" : "block"} text-my-blue`} />
//       </div>

//       {/* Mobile Menu */}
//       <div className={`${isMenuOpen ? "block" : "hidden"} absolute top-0 right-0 bg-my-blue w-full h-screen z-20 p-4`}>
//         {/* kryds-knap til højere side  */}
//         <div className="flex justify-end">
//           <FaTimes size={30} className="text-my-white cursor-pointer mt-4" onClick={toggleMenu} />
//         </div>

//         {/* Menu Links */}
//         <ul className="space-y-4 text-my-white text-lg mt-8 px-2.5 py-2.5">
//           <li>
//             <UserButton />
//           </li>
//           <li>
//             <Link href="/events" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
//               Event Liste
//             </Link>
//           </li>
//           <li>
//             <Link href="/sign-in" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
//               Konto
//             </Link>
//           </li>
//         </ul>
//       </div>

//       {/* {isMenuOpen && <div className="absolute inset-0 bg-my-blue opacity-50 z-10" onClick={toggleMenu}></div>} */}
//     </>
//   );
// };

// export default BurgerMenu;

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
            <li>
              <Link href="/" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                Hjem
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                Event Liste
              </Link>
            </li>
            <li>
              <Link href="/galleri" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                Kunstgalleri
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/createevents" className="font-playfair text-2xl text-orange-600 font-semibold" onClick={toggleMenu}>
                  Opret Event ✨
                </Link>
              </li>
            )}
            <SignedOut>
              <li>
                <Link href="/sign-in" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                  Konto
                </Link>
              </li>
            </SignedOut>
            <SignedIn>
              <li>
                <Link href="/dashboard" className="hover:text-my-graylight font-playfair text-2xl" onClick={toggleMenu}>
                  Min side
                </Link>
              </li>
            </SignedIn>
          </ul>
        </div>
      )}
    </>
  );
}
