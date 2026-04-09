//mappe alle events i localhost

"use client";

import React, { useEffect, useState } from "react";

// Dette er en komponent der henter events og viser dem
export default function EventList() {
  // Her gemmer vi listen af events i en state
  const [events, setEvents] = useState([]);

  // Her gemmer vi det brugeren skriver i formularen
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    locationId: "",
    curator: "",
    description: "",
    artworkIds: "",
  });

  // Denne funktion henter alle events fra backend
  const fetchEvents = () => {
    fetch("https://async-exhibit-server-2awc.onrender.com/events")
      .then((res) => res.json())
      .then((data) => setEvents(data)) // gem i state
      .catch((err) => console.log("Fejl ved hentning:", err));
  };

  // Brug useEffect til at hente events, når siden loader
  useEffect(() => {
    fetchEvents();
  }, []);

  // Denne funktion opdaterer formData, når brugeren skriver i felterne
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Denne funktion sender et nyt event til serveren
  const handleCreate = () => {
    // artworkIds skal være et array
    const dataToSend = {
      ...formData,
      artworkIds: formData.artworkIds.split(",").map((id) => id.trim()),
    };
  };
}
