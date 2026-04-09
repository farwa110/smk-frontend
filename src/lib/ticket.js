// src / lib /ticket.js;

export const bookEvent = async (eventId, tickets) => {
  try {
    const response = await fetch(`https://async-exhibit-server-2awc.onrender.com/events/${eventId}/book`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tickets }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error booking event:", error);
    throw error;
  }
};
