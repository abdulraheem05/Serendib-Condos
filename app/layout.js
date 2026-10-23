import "leaflet/dist/leaflet.css";
import "./globals.css";
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: "Serendib Condos | Sri Lanka Property",
    template: "%s | Serendib Condos",
  },
  description:
    "Explore Sri Lankan condos and apartments with guidance for overseas buyers. A bridge between Canada and Sri Lanka.",
  icons: { icon: "/assets/logo.png" },
  openGraph: {
    title: "Serendib Condos",
    description: "A place to call home. A connection to Sri Lanka.",
    type: "website",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 1600,
        height: 1067,
        alt: "Modern apartment living",
      },
    ],
  },
};
export const viewport = { themeColor: "#102c3c" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
