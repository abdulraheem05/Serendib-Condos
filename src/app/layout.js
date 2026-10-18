import "./globals.css";

export const metadata = {
  title: "Serendib Condos | Sri Lanka Property",
  description:
    "A place to call home. A connection to Sri Lanka. Explore condominium opportunities across Sri Lanka with guidance designed for buyers living in Canada.",
  applicationName: "Serendib Condos",
  openGraph: {
    title: "Serendib Condos | Sri Lanka Property",
    description: "Explore condominium opportunities across Sri Lanka with guidance designed for buyers living in Canada.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0D1C31",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload the two faces used above the fold */}
        <link rel="preload" href="/assets/fonts/ringle/Ringle-Bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/assets/fonts/google-sans/GoogleSans-Medium.latin.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
