// app/actions/eventActions.js
"use server";

import { deleteEvent, bookEvent } from "@/lib/api";

export async function deleteEventAction(formData) {
  const id = formData.get("id");
  console.log("🗑️ Forsøger at slette event med ID:", id);
  if (!id) throw new Error("❌ ID mangler");

  try {
    await deleteEvent(id);
  } catch (error) {
    console.error("❌ Fejl i deleteEvent:", error.message);
    throw new Error("Kunne ikke slette event – " + error.message);
  }
}

export async function bookEventAction(formData) {
  const id = formData.get("id");
  console.log("📦 Booker event med ID:", id);
  if (!id) throw new Error("❌ ID mangler");

  try {
    await bookEvent(id, { quantity: 1 });
  } catch (error) {
    console.error("❌ Fejl i bookEvent:", error.message);
    throw new Error("Kunne ikke booke event – " + error.message);
  }
}
