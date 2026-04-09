// // '// // src/lib/fetchArtworks.js

// import dummy from "../app/assets/dummy.webp";

// export const fetchArtworks = async (objectNumbers) => {
//   const imagePromises = objectNumbers.map(async (id) => {
//     try {
//       const response = await fetch(`https://api.smk.dk/api/v1/art/?object_number=${id}`);
//       const data = await response.json();

//       console.log(`API response for ID ${id}:`, data);

//       const item = data.items?.[0];
//       if (!item) {
//         console.warn(`No item found for ID: ${id}`);
//         return null;
//       }

//       const image = item.has_image ? item.image_thumbnail : dummy.src;
//       const objectNumber = item.object_number;

//       const fullTitle = item.titles?.[0]?.title ?? "Untitled";
//       const title = fullTitle.split(":")[0];

//       const artist = item.artist?.[0] ?? "Unknown artist";

//       console.log(`Processed artwork [${objectNumber}]:`, { title, artist, image });

//       return {
//         image,
//         objectNumber,
//         title,
//         artist,
//       };
//     } catch (error) {
//       console.error(`Error fetching artwork for ID ${id}:`, error);
//       return null;
//     }
//   });

//   const results = await Promise.all(imagePromises);
//   return results.filter(Boolean);
// };

import dummy from "../app/assets/dummy.webp";

// Supabase image extensions to skip
const isImageFile = (id) => /\.(png|jpg|jpeg|webp|gif)$/i.test(id);

export const fetchArtworks = async (objectNumbers) => {
  // Filter out uploaded image filenames — only keep SMK IDs
  const smkIds = objectNumbers.filter((id) => !isImageFile(id));

  const imagePromises = smkIds.map(async (id) => {
    try {
      const response = await fetch(`https://api.smk.dk/api/v1/art/?object_number=${id}`);
      const data = await response.json();

      const item = data.items?.[0];
      if (!item) {
        console.warn(`No item found for ID: ${id}`);
        return null;
      }

      const image = item.has_image ? item.image_thumbnail : dummy.src;
      const objectNumber = item.object_number;
      const fullTitle = item.titles?.[0]?.title ?? "Untitled";
      const title = fullTitle.split(":")[0];
      const artist = item.artist?.[0] ?? "Unknown artist";

      return { image, objectNumber, title, artist };
    } catch (error) {
      console.error(`Error fetching artwork for ID ${id}:`, error);
      return null;
    }
  });

  const results = await Promise.all(imagePromises);
  return results.filter(Boolean);
};
