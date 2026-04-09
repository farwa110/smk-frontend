import Image from "next/image";

export default function TestImage() {
  return (
    <div>
      <h2>Test Supabase Image</h2>
      <Image src="https://laqizwqplonobdzjohhg.supabase.co/storage/v1/object/public/artworks/4b5d906e-626f-4ab5-82b9-ff9be6d8db11.png" alt="Test Image" width={400} height={300} />
    </div>
  );
}
