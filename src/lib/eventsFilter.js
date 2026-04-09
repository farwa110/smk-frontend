export const eventsFilter = async () => {
  const response = await fetch(`https://smk-backend-f1ia.onrender.com/locations`);
  const data = await response.json();

  return data;
};
