// import { ClerkProvider } from "@clerk/nextjs";
// import { Playfair_Display, Noto_Sans } from "next/font/google";
// import ClientHeaderWrapper from "./components/ClientHeaderWrapper";
// import Footer from "./components/Footer";
// import "./globals.css";

// const playfair = Playfair_Display({ weight: ["400", "800"], subsets: ["latin"], variable: "--font-playfair" });
// const notosans = Noto_Sans({ weight: ["200", "900"], subsets: ["latin"], variable: "--font-notosans" });

// export default function RootLayout({ children }) {
//   return (
//     <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
//       <html lang="en" className={`${playfair.variable} ${notosans.variable}`}>
//         <body suppressHydrationWarning>
//           <ClientHeaderWrapper />
//           <main>{children}</main>
//           <Footer />
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }

import { ClerkProvider } from "@clerk/nextjs";
import { Playfair_Display, Noto_Sans } from "next/font/google";
import ClientHeaderWrapper from "./components/ClientHeaderWrapper";
import Footer from "./components/Footer";
import "./globals.css";

const playfair = Playfair_Display({ weight: ["400", "800"], subsets: ["latin"], variable: "--font-playfair" });
const notosans = Noto_Sans({ weight: ["200", "900"], subsets: ["latin"], variable: "--font-notosans" });

// ── SEO & Metadata ───────────────────────────────────────
export const metadata = {
  title: {
    default: "SMK — Statens Museum for Kunst",
    template: "%s | SMK", // har page ka title: "Events | SMK"
  },
  description: "Oplev kunst, events og udstillinger på Statens Museum for Kunst i København.",
  keywords: ["SMK", "Statens Museum for Kunst", "kunst", "events", "udstillinger", "København"],
  authors: [{ name: "SMK" }],
  creator: "SMK",
  metadataBase: new URL("https://smk-museum.vercel.app/"), // ← apna domain likho
  openGraph: {
    title: "SMK — Statens Museum for Kunst",
    description: "Oplev kunst, events og udstillinger på Statens Museum for Kunst.",
    url: "https://smk-museum.vercel.app/",
    siteName: "SMK",
    images: [
      {
        url: "/bluelogo.png", // public folder mein hona chahiye
        width: 800,
        height: 600,
        alt: "SMK Logo",
      },
    ],
    locale: "da_DK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMK — Statens Museum for Kunst",
    description: "Oplev kunst, events og udstillinger på Statens Museum for Kunst.",
    images: ["/bluelogo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/bluelogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="da" className={`${playfair.variable} ${notosans.variable}`}>
        <body suppressHydrationWarning>
          <ClientHeaderWrapper />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
