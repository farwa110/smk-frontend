// src/lib/galleri.js

export const gallerivaerk = async () => {
  const randomOffset = Math.floor(Math.random() * 100);
  const apiUrl = `https://api.smk.dk/api/v1/art/search?keys=%2A&filters=%5Bhas_image%3Atrue%5D&offset=${randomOffset}&rows=10`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
};
