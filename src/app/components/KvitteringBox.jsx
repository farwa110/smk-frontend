// "use client";
// import Image from "next/image";
// import lightgray from "../../app/assets/lightgray.svg";

// const KvitteringBox = ({ data }) => {
//   return (
//     <div className="relative w-full h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px] overflow-hidden">
//       {/* Optional frame overlay */}

//       <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
//         <Image src={lightgray} alt="Decorative Frame" className="w-full max-w-2xl h-auto lg:my-20 max-[500px]:hidden" />
//       </div>

//       {/* Content box fixed inside frame */}
//       <div className="relative z-20 px-6 py-5 flex justify-center items-center h-full mx-5 max-[400px]:p-0 max-[400px]:mx-0">
//         <div className=" max-w-xl  text-my-blue p-6 sm:p-8  space-y-6 max-[400px]:p-2">
//           <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-center">Tak for tilmelding</h1>

//           <p className="text-base sm:text-lg font-sans text-center px-4.5 max-[400px]:px-1.5 ">
//             Du har bestilt billetter til <strong>{data.title}</strong>. Vi glæder os til at møde dig den <strong>{data.date}</strong> i <strong>{data.location.name}</strong>.
//           </p>

//           <p className="text-base sm:text-lg font-sans text-center px-4.5 max-[400px]:px-1.5">Hvis du gerne vil have en mail med dine billetter, kan du skrive din mail herunder:</p>

//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-center">
//             <input type="email" className="border border-my-blue bg-gray-100 px-4 py-2 sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-my-blue" placeholder="placeholder@mail.com" />
//             <button type="submit" className="bg-my-blue hover:bg-my-bluedark text-white px-6 py-2 transition-all">
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KvitteringBox;

"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
// import lightgray from "../../app/assets/lightgray.svg";

const KvitteringBox = ({ data }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [showTicket, setShowTicket] = useState(true);

  const qrRef = useRef(null);

  const ticketUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/ticket/${data.id}`;
  }, [data.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ticketUrl);
      setStatus("Billetlink kopieret.");
    } catch {
      setStatus("Kunne ikke kopiere link.");
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket-${data.id}.png`;
    link.click();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!email.trim()) {
      setStatus("Skriv venligst din mailadresse.");
      return;
    }

    setSending(true);

    try {
      // Replace this with EmailJS or your own API later
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setStatus("Billet klar.");
      setEmail("");
    } catch {
      setStatus("Noget gik galt. Prøv igen.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative w-full min-h-[650px] sm:min-h-[760px] md:min-h-[860px] lg:min-h-[950px] overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">{/* <Image src={lightgray} alt="Decorative Frame" className="w-full max-w-2xl h-auto lg:my-20 max-[500px]:hidden" /> */}</div>

      <div className="relative z-20 px-6 py-6 flex justify-center items-center h-full mx-5 max-[400px]:px-2 max-[400px]:mx-0">
        <div className="max-w-xl text-my-blue p-6 sm:p-8 space-y-6 text-center">
          <h1 className="text-2xl sm:text-4xl font-playfair font-bold">Tak for tilmelding</h1>

          <p className="text-base sm:text-lg font-sans leading-8">
            Du har bestilt billetter til <strong>{data.title}</strong>. Vi glæder os til at møde dig den <strong>{data.date}</strong> i <strong>{data.location.name}</strong>.
          </p>

          <div className="bg-white/80 border border-my-bluelight rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-sm sm:text-base font-sans">Vis denne billet ved indgangen eller send billetlinket til dig selv.</p>

            {showTicket && (
              <div className="flex justify-center">
                <div className="bg-white border border-my-bluelight/40 rounded-2xl p-5 shadow-md">
                  <p className="text-sm font-sans mb-3">Din billet QR-kode</p>
                  <div ref={qrRef}>
                    <QRCodeCanvas value={ticketUrl} size={180} bgColor="#ffffff" fgColor="#2b346b" level="H" includeMargin />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="button" onClick={handleCopyLink} className="border border-my-blue text-my-blue px-4 py-2 rounded-lg hover:bg-my-bluelight/20 transition">
                Kopiér billetlink
              </button>

              <button type="button" onClick={handleDownloadQR} className="border border-my-blue text-my-blue px-4 py-2 rounded-lg hover:bg-my-bluelight/20 transition">
                Download QR
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-base sm:text-lg font-sans px-2">Skriv din mail herunder, hvis du også vil sende billetten til dig selv.</p>

            <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-center">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-my-blue bg-gray-100 px-4 py-3 sm:max-w-xs w-full focus:outline-none focus:ring-2 focus:ring-my-blue rounded-l-lg sm:rounded-r-none" placeholder="placeholder@mail.com" disabled={sending} />

              <button type="submit" disabled={sending} className="bg-my-blue hover:bg-my-bluedark text-white px-6 py-3 transition-all rounded-lg sm:rounded-l-none disabled:opacity-70 min-w-[130px] flex items-center justify-center gap-2">
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    Sender...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </form>

            {status && <p className="text-sm font-sans text-center text-my-blue">{status}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KvitteringBox;
