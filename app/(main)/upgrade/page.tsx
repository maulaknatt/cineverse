"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, Zap, BarChart3, Tv, Flame, CreditCard, Lock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export default function UpgradePage() {
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCvc(value);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid 16-digit card number.");
      return;
    }
    if (expiry.length < 5) {
      setError("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (cvc.length < 3) {
      setError("Please enter a valid 3-digit CVC code.");
      return;
    }
    if (!cardName.trim()) {
      setError("Please enter the cardholder's name.");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Stripe payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const res = await fetch("/api/pro/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to process database upgrade");
      }
    } catch (err) {
      console.error(err);
      setError("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/[0.03] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/[0.02] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-4xl w-full px-4 relative z-10">
        <AnimatePresence mode="wait">
          {!showCheckout && !isSuccess ? (
            /* Pricing Landing Page */
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* Marketing side */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 text-[#E50914] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  CineVerse Premium
                </div>
                
                <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
                  Elevate Your <span className="text-[#E50914]">CineVerse</span> Experience
                </h1>
                
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Join CineVerse PRO to unlock the full potential of our platform. Get smart recommendations, advanced insights, and support our community.
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    { icon: Zap, label: "Unlimited AI Recommendations", desc: "No daily limit on CineBot and Similar Picks" },
                    { icon: BarChart3, label: "Advanced Analytics Dashboard", desc: "Unlock detailed charts of genres, actors, and watch times" },
                    { icon: Tv, label: "Ad-Free Experience", desc: "No sponsor banners anywhere on the platform" },
                    { icon: Flame, label: "Golden PRO Badge", desc: "Show off your verified gold profile badge to the community" },
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-[#E50914]/10 flex items-center justify-center text-[#E50914] shrink-0 mt-0.5">
                        <feat.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs leading-none">{feat.label}</h4>
                        <p className="text-zinc-500 text-[10px] mt-1">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Card */}
              <div className="glass border-white/10 hover:border-[#E50914]/30 p-8 rounded-3xl relative overflow-hidden shadow-2xl space-y-6 flex flex-col justify-between h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E50914]/[0.03] rounded-full blur-[40px] pointer-events-none" />
                
                <div className="space-y-2">
                  <h3 className="text-white font-bold text-xl">PRO Member</h3>
                  <p className="text-zinc-400 text-xs">For movie enthusiasts who want the best features.</p>
                </div>

                <div className="py-2">
                  <div className="flex items-baseline text-white">
                    <span className="text-4xl font-extrabold">$4.99</span>
                    <span className="text-zinc-400 text-xs ml-1">/ month</span>
                  </div>
                  <p className="text-zinc-500 text-[10px] mt-1">Cancel anytime. Secure checkout.</p>
                </div>

                <div className="space-y-3 border-t border-white/5 pt-6">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-[#E50914] hover:bg-[#b8070f] text-white py-3 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 transform active:scale-98 cursor-pointer flex items-center justify-center gap-1"
                  >
                    Get PRO Now
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="w-full bg-white/5 hover:bg-white/10 text-zinc-300 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </motion.div>
          ) : showCheckout && !isSuccess ? (
            /* Credit Card Checkout Simulation */
            <motion.div
              key="checkout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto glass border-white/15 rounded-3xl p-8 shadow-2xl relative"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E50914]" />
                Secure Checkout
              </h2>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl mb-4 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitPayment} className="space-y-4">
                {/* Card Number */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E50914] transition-colors"
                    />
                    <CreditCard className="w-4 h-4 text-zinc-500 absolute right-4 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E50914] transition-colors"
                    />
                  </div>
                  {/* CVC */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">CVC</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cvc}
                      onChange={handleCvcChange}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E50914] transition-colors"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#E50914] transition-colors"
                  />
                </div>

                {/* Info Text */}
                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] py-2 border-t border-white/5 mt-4">
                  <Lock className="w-3 h-3" />
                  <span>Secure 256-bit SSL encrypted transaction. MOCK Stripe payment.</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#E50914] hover:bg-[#b8070f] text-white py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                        className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing secure payment...
                    </>
                  ) : (
                    "Authorize Payment ($4.99)"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  disabled={isProcessing}
                  className="w-full text-zinc-400 hover:text-white py-2 text-xs transition-all font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          ) : (
            /* Payment Success Screen with Confetti animation */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto glass border-[#E50914]/20 rounded-3xl p-8 text-center shadow-2xl relative space-y-6"
            >
              {/* Confetti Falling SVG elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: Math.random() * 300 - 150,
                      y: -50,
                      rotate: 0,
                      opacity: 1,
                    }}
                    animate={{
                      y: 400,
                      rotate: Math.random() * 360,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 2.5 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 1.5,
                    }}
                    className={cn(
                      "absolute w-2 h-2 rounded",
                      i % 4 === 0 ? "bg-[#E50914]" : i % 4 === 1 ? "bg-amber-400" : i % 4 === 2 ? "bg-sky-400" : "bg-emerald-400"
                    )}
                    style={{ left: `${50 + (Math.random() * 60 - 30)}%` }}
                  />
                ))}
              </div>

              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto text-amber-500 shadow-lg shadow-amber-500/15">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  You are now <span className="text-amber-500">PRO</span>!
                </h2>
                <p className="text-zinc-400 text-xs max-w-xs mx-auto leading-relaxed">
                  Your billing is verified. All PRO features (Unlimited AI, Advanced Analytics, and Ad-Free) are now active on your account.
                </p>
              </div>

              <button
                onClick={() => {
                  router.push("/dashboard");
                  router.refresh();
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-extrabold text-xs shadow-lg transition-all duration-300 cursor-pointer"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
