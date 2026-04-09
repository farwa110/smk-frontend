"use client";
import React, { useState, useEffect } from "react";
import dummy from "../assets/dummy.webp";
import lightgray from "../assets/lightgray.svg";

const KunstThumbnail = ({ images }) => {
  const fallbackImage = dummy.src;
  const [mainLoading, setMainLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(fallbackImage);

  useEffect(() => {
    const updateImageState = async () => {
      if (images && images.length > 0) {
        const isValidImage = await checkImageValidity(images);
        setSelectedImage(isValidImage ? images : fallbackImage);
      } else {
        setSelectedImage(fallbackImage);
      }
      setMainLoading(false);
    };

    updateImageState();
  }, [images]);

  const checkImageValidity = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  return (
    // <div className="relative aspect-square mb-4 w-full overflow-visible">
    <div className="relative aspect-square w-full max-w-[600px] mx-auto">
      {/* Loading Overlay */}
      {mainLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
          <span className="text-gray-600 text-sm">Loading...</span>
        </div>
      )}

      {/* Artwork image */}
      <img src={selectedImage} alt="Main image" className="w-full h-full object-cover relative z-0" />

      {/* SVG frame overlay */}
      <img src={lightgray.src} alt="Museum Frame" className="absolute inset-0 w-full h-full z-20 pointer-events-none scale-[1.22]" style={{ transformOrigin: "center" }} />
    </div>
  );
};

export default KunstThumbnail;

// "use client";
// import React, { useState, useEffect } from "react";
// import dummy from "../assets/dummy.webp";
// // import lightgray from "../assets/lightgray.svg";

// const KunstThumbnail = ({ images }) => {
//   const fallbackImage = dummy.src;
//   const [mainLoading, setMainLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(fallbackImage);

//   useEffect(() => {
//     const updateImageState = async () => {
//       if (images && images.length > 0) {
//         const isValidImage = await checkImageValidity(images);
//         setSelectedImage(isValidImage ? images : fallbackImage);
//       } else {
//         setSelectedImage(fallbackImage);
//       }
//       setMainLoading(false);
//     };

//     updateImageState();
//   }, [images]);

//   const checkImageValidity = (url) => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.src = url;
//       img.onload = () => resolve(true);
//       img.onerror = () => resolve(false);
//     });
//   };

//   return (
//     <div>
//       {/* <Image src={lightgray} alt="Museum Frame" className="absolute inset-0 w-full h-full pointer-events-none z-10 scale-[1.0]"> */}
//       <div className="relative aspect-square mb-4 flex items-center justify-center">
//         {mainLoading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
//             <span className="text-gray-600 text-sm">Loading...</span>
//           </div>
//         )}
//         <img src={selectedImage} alt="Main image" className="w-full h-full object-cover" />
//       </div>
//     </div>
//   );
// };

// export default KunstThumbnail;
