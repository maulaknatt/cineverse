import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          card: "bg-[#18181B]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all",
          socialButtonsBlockButtonText: "text-white font-medium",
          formButtonPrimary: "bg-[#E50914] hover:bg-[#b20710] text-white transition-colors shadow-lg shadow-[#E50914]/20",
          formFieldLabel: "text-zinc-300",
          formFieldInput: "bg-[#27272A] border-white/10 text-white focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] rounded-lg",
          footerActionText: "text-zinc-400",
          footerActionLink: "text-[#E50914] hover:text-[#ff1a24] transition-colors",
          identityPreviewText: "text-white",
          identityPreviewEditButtonIcon: "text-zinc-400 hover:text-white",
          formFieldSuccessText: "text-green-400",
          formFieldErrorText: "text-red-400",
        },
      }}
    />
  );
}
