"use client";

import { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const KvitteringBox = ({ data }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const qrRef = useRef(null);

  const ticketUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/ticket/${data.id}`;
  }, [data.id]);

  const handleDownloadPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const qrDataUrl = canvas.toDataURL("image/png");

    // Background
    pdf.setFillColor(252, 251, 248);
    pdf.rect(0, 0, 210, 297, "F");

    // Decorative border lines
    pdf.setDrawColor(43, 52, 107);
    pdf.setLineWidth(0.8);
    pdf.rect(12, 12, 186, 273);
    pdf.setLineWidth(0.3);
    pdf.rect(15, 15, 180, 267);

    // SMK title
    pdf.setFont("times", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(43, 52, 107);
    pdf.text("STATENS MUSEUM FOR KUNST", 105, 32, { align: "center" });

    // Divider
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(43, 52, 107);
    pdf.line(40, 36, 170, 36);

    // Main heading
    pdf.setFont("times", "bold");
    pdf.setFontSize(26);
    pdf.text("Tak for tilmelding", 105, 55, { align: "center" });

    // Event details
    pdf.setFont("times", "normal");
    pdf.setFontSize(13);
    pdf.setTextColor(60, 70, 100);
    pdf.text(`${data.title}`, 105, 72, { align: "center" });

    pdf.setFontSize(11);
    pdf.setTextColor(100, 110, 140);
    pdf.text(`${data.date}  ·  ${data.location?.name ?? ""}`, 105, 82, { align: "center" });

    // Divider
    pdf.setLineWidth(0.2);
    pdf.setDrawColor(180, 190, 220);
    pdf.line(60, 90, 150, 90);

    // QR code
    pdf.addImage(qrDataUrl, "PNG", 72, 98, 66, 66);

    // QR label
    pdf.setFont("times", "italic");
    pdf.setFontSize(9);
    pdf.setTextColor(130, 140, 170);
    pdf.text("Vis denne kode ved indgangen", 105, 172, { align: "center" });

    // Ticket ID
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(160, 170, 190);
    pdf.text(`Billet #${data.id}`, 105, 180, { align: "center" });

    // Bottom divider
    pdf.setLineWidth(0.2);
    pdf.setDrawColor(180, 190, 220);
    pdf.line(40, 260, 170, 260);

    // Footer
    pdf.setFont("times", "italic");
    pdf.setFontSize(9);
    pdf.setTextColor(130, 140, 170);
    pdf.text("Vi glæder os til at se dig · smk.dk", 105, 268, { align: "center" });

    pdf.save(`billet-${data.id}.pdf`);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Skriv venligst din mailadresse.");
      return;
    }
    setSending(true);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email: email.trim(), event_title: data.title, event_date: data.date, event_location: data.location?.name ?? "", ticket_url: ticketUrl }, EMAILJS_PUBLIC_KEY);
      setSent(true);
      setEmail("");
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Noget gik galt. Prøv igen.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center px-4 py-10">
      {/* ── Decorative SVG border ───────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 750" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer rect */}
        <rect x="8" y="8" width="684" height="734" rx="2" fill="none" stroke="#2b346b" strokeWidth="1.2" />
        {/* Inner rect */}
        <rect x="18" y="18" width="664" height="714" rx="1" fill="none" stroke="#2b346b" strokeWidth="0.5" />
        {/* Corner ornaments — top left */}
        <g stroke="#2b346b" strokeWidth="0.8" fill="none">
          <path d="M8 40 Q8 8 40 8" />
          <path d="M18 45 Q18 18 45 18" />
          <circle cx="35" cy="35" r="4" fill="#2b346b" fillOpacity="0.15" />
          <line x1="8" y1="8" x2="28" y2="28" strokeWidth="0.4" />
        </g>
        {/* Corner ornaments — top right */}
        <g stroke="#2b346b" strokeWidth="0.8" fill="none">
          <path d="M692 40 Q692 8 660 8" />
          <path d="M682 45 Q682 18 655 18" />
          <circle cx="665" cy="35" r="4" fill="#2b346b" fillOpacity="0.15" />
          <line x1="692" y1="8" x2="672" y2="28" strokeWidth="0.4" />
        </g>
        {/* Corner ornaments — bottom left */}
        <g stroke="#2b346b" strokeWidth="0.8" fill="none">
          <path d="M8 710 Q8 742 40 742" />
          <path d="M18 705 Q18 732 45 732" />
          <circle cx="35" cy="715" r="4" fill="#2b346b" fillOpacity="0.15" />
          <line x1="8" y1="742" x2="28" y2="722" strokeWidth="0.4" />
        </g>
        {/* Corner ornaments — bottom right */}
        <g stroke="#2b346b" strokeWidth="0.8" fill="none">
          <path d="M692 710 Q692 742 660 742" />
          <path d="M682 705 Q682 732 655 732" />
          <circle cx="665" cy="715" r="4" fill="#2b346b" fillOpacity="0.15" />
          <line x1="692" y1="742" x2="672" y2="722" strokeWidth="0.4" />
        </g>
        {/* Top center ornament */}
        <g stroke="#2b346b" strokeWidth="0.6" fill="none">
          <line x1="200" y1="8" x2="280" y2="8" />
          <line x1="420" y1="8" x2="500" y2="8" />
          <circle cx="350" cy="8" r="3" fill="#2b346b" fillOpacity="0.3" />
          <path d="M310 8 Q350 20 390 8" strokeWidth="0.5" />
        </g>
        {/* Bottom center ornament */}
        <g stroke="#2b346b" strokeWidth="0.6" fill="none">
          <line x1="200" y1="742" x2="280" y2="742" />
          <line x1="420" y1="742" x2="500" y2="742" />
          <circle cx="350" cy="742" r="3" fill="#2b346b" fillOpacity="0.3" />
          <path d="M310 742 Q350 730 390 742" strokeWidth="0.5" />
        </g>
      </svg>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-lg px-10 py-12 text-center text-my-blue space-y-6">
        {/* SMK label */}
        <p className="text-xs tracking-[0.25em] uppercase text-my-blue/50 font-sans">Statens Museum for Kunst</p>

        {/* Heading */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold">Tak for tilmelding</h1>
          <p className="text-sm text-my-blue/60 mt-2 font-sans leading-6">
            Du har bestilt billet til <strong className="text-my-blue">{data.title}</strong>
            <br />
            den <strong>{data.date}</strong> i <strong>{data.location?.name}</strong>
          </p>
        </div>

        {/* Thin divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-my-blue/15" />
          <div className="w-1 h-1 bg-my-blue/30" />
          <div className="flex-1 h-px bg-my-blue/15" />
        </div>

        {/* QR code */}
        <div className="flex justify-center">
          <div ref={qrRef} className="bg-white border border-my-blue/10  p-4 shadow-sm inline-block">
            <QRCodeCanvas value={ticketUrl} size={140} bgColor="#ffffff" fgColor="#2b346b" level="H" includeMargin={false} />
          </div>
        </div>
        <p className="text-xs text-my-blue/40 font-sans italic -mt-2">Vis denne kode ved indgangen</p>

        {/* Thin divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-my-blue/15" />
          <div className="w-1 h-1  bg-my-blue/30" />
          <div className="flex-1 h-px bg-my-blue/15" />
        </div>

        {/* PDF download */}
        <button onClick={handleDownloadPDF} className="inline-flex items-center gap-2 border border-my-blue/30 text-my-blue text-sm px-6 py-2.5  hover:bg-my-blue/5 transition font-sans">
          <DownloadIcon />
          Download billet som PDF
        </button>

        {/* Email section */}
        <div className="space-y-3">
          <p className="text-sm font-sans text-my-blue/70">Eller send billetten til din mail:</p>

          {sent ? (
            <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Mail afsendt! Tjek din indbakke.
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex gap-2 justify-center">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="din@mail.dk" disabled={sending} className="text-sm px-4 py-2.5  border border-my-blue/20 bg-white/80 focus:outline-none focus:ring-2 focus:ring-my-blue/20 w-56 disabled:opacity-60" />
              <button type="submit" disabled={sending} className="bg-my-orange hover:bg-my-orange/80 text-white text-sm px-5 py-2.5 transition disabled:opacity-60 min-w-[80px] flex items-center justify-center gap-1.5">
                {sending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-t-transparent border-white animate-spin" />
                    Sender...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </form>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <p className="text-xs text-my-blue/30 font-sans italic pt-2">Vi glæder os til at se dig · smk.dk</p>
      </div>
    </div>
  );
};

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.4}>
    <path strokeLinecap="round" d="M8 2v7M5 7l3 3 3-3M3 12v1.5A.5.5 0 003.5 14h9a.5.5 0 00.5-.5V12" />
  </svg>
);

export default KvitteringBox;
