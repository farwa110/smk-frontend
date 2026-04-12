// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import singleevent from "../assets/singleevent.png";

// const EventBilledeBox = ({ imageUrl }) => {
//   const [imgSrc, setImgSrc] = useState(imageUrl || singleevent.src);

//   return (
//     <div className="w-full relative aspect-video lg:aspect-[4/3] lg:h-[500px]">
//       <Image
//         src={imgSrc}
//         alt="Event"
//         fill
//         className="object-cover px-4 lg:px-0"
//         onError={() => setImgSrc(singleevent.src)}
//         unoptimized={true} // Hvis der er problemer med Next.js billedoptimering
//       />
//     </div>
//   );
// };

// export default EventBilledeBox;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import singleevent from "../assets/singleevent.png";

const EventBilledeBox = ({ imageUrl }) => {
  const [imgSrc, setImgSrc] = useState(imageUrl || singleevent.src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full relative aspect-video lg:aspect-[4/3] lg:h-[500px]">
      {/* Skeleton — jab tak image load na ho */}
      {!loaded && (
        <div className="absolute inset-0 px-4 lg:px-0">
          <div className="w-full h-full bg-my-blue/10 animate-pulse" />
        </div>
      )}

      {/* <Image
        src={imgSrc}
        alt="Event"
        fill
        className={`object-cover px-4 lg:px-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setImgSrc(singleevent.src);
          setLoaded(true);
        }}
        unoptimized={true}
      /> */}
      <Image
        src={imgSrc}
        alt="Event"
        fill
        sizes="100vw"
        className="object-cover px-4 lg:px-0"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setImgSrc(singleevent.src);
          setLoaded(true);
        }}
        unoptimized={true}
      />
    </div>
  );
};

export default EventBilledeBox;
