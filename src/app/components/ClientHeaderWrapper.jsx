"use client";

import dynamic from "next/dynamic";

// Indlæs Header kun i browseren
const Header = dynamic(() => import("./Header"), { ssr: false });

export default function ClientHeaderWrapper() {
  return <Header />;
}
