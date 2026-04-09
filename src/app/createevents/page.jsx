import CreateEvent from "../components/CreateEvent";

// Zod validering (du kan stadig bruge det i JS)

export default async function EventForm() {
  // Hent datoer
  const resDates = await fetch("https://async-exhibit-server-2awc.onrender.com/dates");
  const dateData = await resDates.json();

  // Hent lokationer
  const resLoc = await fetch("https://async-exhibit-server-2awc.onrender.com/locations");
  const locData = await resLoc.json();

  return <CreateEvent date={dateData} locations={locData} />;
}
