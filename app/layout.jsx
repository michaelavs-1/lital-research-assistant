import "./globals.css";

export const metadata = {
  title: "Lital's Research Co-Pilot",
  description: "AI writing partner for context-informed social work research",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
