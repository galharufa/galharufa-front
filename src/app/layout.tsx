import "./globals.css";
import { Montserrat } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";

interface MetadataBase {
  title?: string | {
    template: string;
    default: string;
  };
  description?: string;
  icons?: Record<string, unknown>;
  metadataBase?: {
    url?: string;
  };
}

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export const metadata: MetadataBase = {
  title: {
    template: "%s | Agência Galharufa",
    default: "Agência Galharufa",
  },
  description: "Agência de elenco e casting especializada em fornecer os melhores talentos para seu projeto audiovisual.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: {
    url: "https://www.agenciagalharufa.com.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
