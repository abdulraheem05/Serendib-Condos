/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // All imagery is local (public/assets/images). If you later add remote photography,
    // allow its host here, e.g. remotePatterns: [{ protocol: "https", hostname: "images.example.com" }]
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
