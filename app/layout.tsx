import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CineVerse",
  description: "Discover Movies Smarter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${inter.className} bg-[#09090B] text-white antialiased`} suppressHydrationWarning>
          {children}
          <Toaster richColors theme="dark" position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
