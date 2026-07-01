import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { LanguageProvider, Language } from "@/context/language-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CineVerse",
  description: "Discover Movies Smarter",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "en") as Language;

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_dummy"}
      appearance={{
        variables: { colorPrimary: "#E50914" },
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
          termsPageUrl: "https://clerk.com/terms",
        },
      }}
    >
      <html lang={lang} className="dark" suppressHydrationWarning>
        <body className={`${inter.className} bg-[#09090B] text-white antialiased`} suppressHydrationWarning>
          <LanguageProvider initialLang={lang}>
            {children}
          </LanguageProvider>
          <Toaster richColors theme="dark" position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
