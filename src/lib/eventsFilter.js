export const eventsFilter = async () => {
  const response = await fetch(`https://async-exhibit-server-2awc.onrender.com/locations`);
  const data = await response.json();

  return data;
};
