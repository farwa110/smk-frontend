"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";

export default function BackButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    setLoading(true);

    setTimeout(() => {
      if (typeof window !== "undefined" && window.history.length > 2) {
        router.back();
      } else {
        router.push("/events");
      }
    }, 100);
  };

  return (
    <motion.button onClick={handleBack} disabled={loading} className="flex items-center gap-2 px-2 py-1 text-my-blue hover:text-my-orange disabled:opacity-50 focus:outline-none" style={{ background: "transparent", border: "none" }} aria-label="Go back" whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.95, x: -10 }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      {loading ? (
        <>
          <Spinner />
          <span>Går tilbage...</span>
        </>
      ) : (
        <>
          <motion.span className="flex items-center gap-2" initial={{ x: 0 }} whileHover={{ x: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <FaArrowLeft className="w-4 h-4" />
            <span className="font-playfair">Tilbage</span>
          </motion.span>
        </>
      )}
    </motion.button>
  );
}

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { FaArrowLeft } from "react-icons/fa";
// import Spinner from "../components/Spinner";

// export default function BackButton() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleBack = () => {
//     setLoading(true);

//     setTimeout(() => {
//       if (typeof window !== "undefined" && window.history.length > 2) {
//         router.back();
//       } else {
//         router.push("/events");
//       }
//     }, 100);
//   };

//   return (
//     <button onClick={handleBack} disabled={loading} className="flex items-center gap-2 px-2 py-1 text-my-blue hover:text-my-orange disabled:opacity-50 focus:outline-none" style={{ background: "transparent", border: "none" }} aria-label="Go back">
//       {loading ? (
//         <>
//           <Spinner />
//           <span>Går tilbage...</span>
//         </>
//       ) : (
//         <>
//           <FaArrowLeft className="w-4 h-4" />
//           <span>Tilbage</span>
//         </>
//       )}
//     </button>
//   );
// }
