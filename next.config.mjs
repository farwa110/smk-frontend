/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "laqizwqplonobdzjohhg.supabase.co",
      },
      // {
      //   protocol: "https",
      //   hostname: "iip-thumb.smk.dk",
      // },
      {
        protocol: "https",
        hostname: "iip-thumb.smk.dk",
      },
      {
        protocol: "https",
        hostname: "iip.smk.dk",
      },
      {
        protocol: "https",
        hostname: "api.smk.dk",
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
    ],
  },
};

export default nextConfig;
