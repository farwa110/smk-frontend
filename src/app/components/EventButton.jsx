"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AnimatedButton from "./AnimatedButton";
import Modal from "./Modal";
import Spinner from "./Spinner";
import { bookEvent } from "@/lib/ticket";

const EventButton = (props) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // default loading state

  const ticketGet = async () => {
    setMessage("");

    if (!props.tickets || props.tickets < 1) {
      setMessage("Please select at least 1 ticket.");
      return;
    }

    setLoading(true); // Start spinner

    const result = await bookEvent(props.id, props.tickets);

    setLoading(false); // Stop spinner

    if (result.message === "Tickets booked") {
      setMessage("Tickets booked successfully!");
      router.push(`/kvitering?id=${props.id}`);
    } else if (result.message?.toLowerCase().includes("not enough tickets")) {
      setShowModal(true);
    } else {
      setMessage(result.message || "Something went wrong.");
    }
  };

  return (
    <div className="space-y-2">
      <AnimatedButton onClick={ticketGet} disabled={loading} className="flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Spinner /> Behandler...
          </>
        ) : (
          "Book event"
        )}
      </AnimatedButton>

      {message && <p className="text-sm text-gray-700 font-sans">{message}</p>}

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Sorry!">
        <p className="text-sm text-gray-700 font-sans">Not enough tickets available.</p>
      </Modal>
    </div>
  );
};

export default EventButton;

// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import AnimatedButton from "./AnimatedButton";
// import Modal from "./Modal";
// import { bookEvent } from "@/lib/ticket";

// const EventButton = (props) => {
//   const router = useRouter();
//   const [message, setMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const ticketGet = async () => {
//     setMessage("");

//     if (!props.tickets || props.tickets < 1) {
//       setMessage("Please select at least 1 ticket.");
//       return;
//     }

//     const result = await bookEvent(props.id, props.tickets);

//     if (result.message === "Tickets booked") {
//       setMessage("Tickets booked successfully!");
//       router.push(`/kvitering?id=${props.id}`);
//     } else if (result.message?.toLowerCase().includes("not enough tickets")) {
//       setShowModal(true);
//     } else {
//       setMessage(result.message || "Something went wrong.");
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <AnimatedButton onClick={ticketGet}>Book event</AnimatedButton>
//       {message && <p className="text-sm text-gray-700">{message}</p>}

//       <Modal show={showModal} onClose={() => setShowModal(false)} title="Sorry!">
//         <p className="text-sm text-gray-700">Not enough tickets available.</p>
//       </Modal>
//     </div>
//   );
// };

// export default EventButton;
