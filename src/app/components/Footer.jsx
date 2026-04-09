import React from "react";
import Image from "next/image";
import crownImg from "@/app/assets/crown.png";

const Footer = () => {
  return (
    <footer className="bg-my-blue text-white text-center py-10 flex flex-col items-center space-y-6">
      {/*footer container */}
      <div className="w-full max-w-7xl px-4 flex flex-col sm:flex-row justify-between items-start gap-8 mt-10">
        <div className="w-full sm:max-w-md flex flex-col items-start">
          <h3 className="text-lg sm:text-xl font-semibold mb-1 font-playfair">New’s Letter</h3>
          <p className="text-xs sm:text-sm mb-4 font-sans">Get daily updates about events, products, and more</p>

          <form className="flex flex-col items-stretch gap-2 ">
            <input type="email" placeholder="Enter your email" className=" px-3 py-2 sm:px-4 sm:py-2  text-white border-2 text-sm sm:text-base font-sans" />
            <button type="submit" className=" bg-[#272727]  text-white px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base  transition-colors font-sans hover:bg-[#2B346B] duration-300">
              Subscribe
            </button>
          </form>
        </div>

        <div className="text-sm  text-left flex flex-col pl-1 sm:pl-0 mt-4 sm:mt-0 mb-4 sm:mb-0">
          <h3 className="text-xl font-semibold mb-2 font-playfair">Reach us:</h3>
          <p className="mb-2 font-sans">kontakt@statenmusumforkunst.dk</p>
          <p className="mb-2 font-sans">Statens Museum for Kunst</p>
          <p className="mb-2 font-sans">Sølvgade 48-50</p>
        </div>
      </div>

      {/* Logo */}
      <Image src={crownImg} alt="Crown logo" width={50} height={50} className="mx-auto mt-2" />

      <div>
        <p className="text-sm px-auto font-sans">© {new Date().getFullYear()} Alle rettigheder forbeholdes Statens Museum for Kunst.</p>
      </div>
    </footer>
  );
};

export default Footer;
