"use client";
import Image from "next/image";
import lightgray from "../../app/assets/lightgray.svg";

const KvitteringBox = ({ data }) => {
  return (
    <div className="relative w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px] overflow-hidden">
      {/* Optional frame overlay */}

      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
        <Image src={lightgray} alt="Decorative Frame" className="w-full max-w-2xl h-auto lg:my-20 max-[500px]:hidden" />
      </div>

      {/* Content box fixed inside frame */}
      <div className="relative z-20 px-6 py-5 flex justify-center items-center h-full mx-5 max-[400px]:p-0 max-[400px]:mx-0">
        <div className=" max-w-xl  text-my-blue p-6 sm:p-8  space-y-6 max-[400px]:p-2">
          <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-center">Tak for tilmelding</h1>

          <p className="text-base sm:text-lg font-sans text-center px-4.5 max-[400px]:px-1.5 ">
            Du har bestilt billetter til <strong>{data.title}</strong>. Vi glæder os til at møde dig den <strong>{data.date}</strong> i <strong>{data.location.name}</strong>.
          </p>

          <p className="text-base sm:text-lg font-sans text-center px-4.5 max-[400px]:px-1.5">Hvis du gerne vil have en mail med dine billetter, kan du skrive din mail herunder:</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-center">
            <input type="email" className="border border-my-blue bg-gray-100 px-4 py-2 sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-my-blue" placeholder="placeholder@mail.com" />
            <button type="submit" className="bg-my-blue hover:bg-my-bluedark text-white px-6 py-2 transition-all">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KvitteringBox;
