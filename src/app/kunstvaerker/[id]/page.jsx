// // // src/app/kunstværker/[id]/page.jsx

import React from "react";
import KunstBilledBox from "@/app/components/KunstBilledBox";
import KunstTextBox from "@/app/components/KunstTextBox";
import KunstGalleri from "@/app/components/KunstGalleri";
import BackButton from "@/app/components/BackButton";

export default async function Page({ params }) {
  const { id } = params;

  const response = await fetch(`https://api.smk.dk/api/v1/art/?object_number=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // cache: "no-store",
  });

  const data = await response.json();
  console.log("kunst data:", data);

  return (
    <div>
      <div className="cursor-pointer hover:opacity-80 transition font-sans font-semibold mb-4 mt-3">
        <BackButton />
      </div>
      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 mt-20 mb-20 px-6 max-w-6xl mx-auto">
        <div className="w-full lg:w-1/2 flex flex-col min-h-0 md:p-5">
          <KunstBilledBox data={data} className="flex-grow" />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col min-h-0">
          <KunstTextBox data={data} className="flex-grow overflow-auto" />
        </div>
      </div>
      <KunstGalleri />
    </div>
  );
}
