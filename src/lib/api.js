// // src/lib/api.js

// // Base-URL til din backend; hentes fra miljøvariabel, ellers bruges localhost som fallback (typisk til udvikling)
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// // Henter alle events fra API'et
// export async function getAllEvents() {
//   const res = await fetch(`${API_URL}/events`);
//   if (!res.ok) throw new Error("Kunne ikke hente events");
//   return await res.json();
// }

// // Henter alle tilladte datoer (f.eks. for booking eller planlægning)
// export async function getDates() {
//   const res = await fetch(`${API_URL}/dates`);
//   if (!res.ok) throw new Error("Kunne ikke hente datoer");
//   return await res.json();
// }

// // Henter alle lokationer hvor events kan finde sted
// export async function getLocations() {
//   const res = await fetch(`${API_URL}/locations`);
//   if (!res.ok) throw new Error("Kunne ikke hente lokationer");
//   return await res.json();
// }

// // Opretter et nyt event; kan tage en valgfri Clerk-token hvis API'et kræver auth
// export async function createEvent(data, token) {
//   const res = await fetch(`${API_URL}/events`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}), // Tilføjer token hvis givet
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Kunne ikke oprette event");
//   }

//   return await res.json();
// }

// // Book billetter til et givent event (PUT bruges til at opdatere serverens tilstand)
// export async function bookEvent(id, data) {
//   const res = await fetch(`${API_URL}/events/${id}/book`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Kunne ikke booke billet");
//   }

//   return await res.json();
// }

// // Opdaterer informationer om et eksisterende event
// export async function updateEvent(id, data) {
//   const res = await fetch(`${API_URL}/events/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Kunne ikke opdatere event");
//   }

//   return await res.json();
// }

// // Sletter et event baseret på dets ID
// export async function deleteEvent(id) {
//   const res = await fetch(`${API_URL}/events/${id}`, {
//     method: "DELETE",
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Kunne ikke slette event");
//   }

//   return true; // Returnerer true hvis sletning lykkedes
// }

// // Bruges til at nulstille serverens eventdata – nyttigt til test eller udvikling
// export async function resetEvents() {
//   const res = await fetch(`${API_URL}/events/reset`, {
//     method: "POST",
//   });

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "Kunne ikke nulstille events");
//   }

//   return true;
// }
// lib/api.js

// Definerer base-URL til API'et – bruger miljøvariabel hvis den findes, ellers fallback til localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://async-exhibit-server-2awc.onrender.com";

// Hent alle events fra API'et
export async function getAllEvents() {
  const res = await fetch(`${API_URL}/events`); // Kalder /events endpoint
  if (!res.ok) throw new Error("Kunne ikke hente events"); // Fejlhåndtering
  return await res.json(); // Returnerer JSON med alle events
}

// Opret et nyt event
export async function createEvent(data, token) {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST", // Brug POST til at oprette nyt
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Tilføj auth-token hvis den gives
    },
    body: JSON.stringify(data), // Konverter data til JSON
  });

  if (!res.ok) {
    const error = await res.json(); // Læs fejlbesked fra backend
    console.log(error);
    throw new Error(error.message || "Kunne ikke oprette event");
  }

  return await res.json(); // Returnér det oprettede event
}

// Book et event (f.eks. tilmelding til deltager)
export async function bookEvent(id, data) {
  const res = await fetch(`${API_URL}/events/${id}/book`, {
    method: "PUT", // Brug PUT til at opdatere booking
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Kunne ikke booke billet");
  }

  return await res.json();
}

// Opdater et eksisterende event
export async function updateEvent(id, data) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "PATCH", // Brug PATCH til at ændre noget eksisterende
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // Send ændringer som JSON
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Kunne ikke opdatere event");
  }

  return await res.json(); // Returnér det opdaterede event
}

// Slet et event
export async function deleteEvent(id) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: "DELETE", // Brug DELETE til at fjerne
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Kunne ikke slette event");
  }

  return true; // Returnér successtatus
}
