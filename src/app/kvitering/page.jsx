import KvitteringBox from "@/app/components/KvitteringBox";
import BackButton from "@/app/components/BackButton";

export default async function Kvittering({ searchParams }) {
  const { id } = await searchParams;
  const response = await fetch(`https://smk-backend-f1ia.onrender.com/events/${id}`);
  const data = await response.json();

  return (
    <div>
      <div className="cursor-pointer hover:opacity-80 transition font-sans font-semibold mb-4 mt-3">
        <BackButton />
      </div>
      <div className="mt-2 mb-10 p-5">
        <KvitteringBox data={data} />
      </div>
    </div>
  );
}
