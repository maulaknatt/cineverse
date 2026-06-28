"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const contactOptions = [
    { icon: Mail, label: "Email Support", val: "support@cineverse.com", desc: "Response within 24 hours" },
    { icon: MessageSquare, label: "Live Discord", val: "discord.gg/cineverse", desc: "Chat with the community" },
    { icon: MapPin, label: "Headquarters", val: "Jakarta, Indonesia", desc: "Our creative tech workspace" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#E50914]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-[#E50914]/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Get in <span className="text-[#E50914]">Touch</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have questions, feedback, or business proposals? Send us a message and our team will get back to you shortly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-6 lg:col-span-1">
            {contactOptions.map((opt, index) => (
              <motion.div
                key={opt.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-2xl border border-white/5 p-5 bg-zinc-900/20 hover:border-[#E50914]/20 transition-all duration-300"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-[#E50914] shrink-0">
                    <opt.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{opt.label}</h3>
                    <p className="text-white text-sm font-bold mt-0.5">{opt.val}</p>
                    <p className="text-zinc-500 text-[10px] mt-0.5">{opt.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-3xl border border-white/10 p-6 sm:p-8 bg-zinc-900/40 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/30 to-transparent" />
              
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-white text-xl font-bold">Message Sent Successfully!</h3>
                  <p className="text-zinc-400 text-xs max-w-sm">
                    Thank you for reaching out. We will review your message and reply as soon as possible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-xs font-bold text-[#E50914] hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 text-xs font-bold">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#18181B] rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 outline-none border border-white/10 focus:border-[#E50914]/40 focus:bg-[#1f1f23] transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-400 text-xs font-bold">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#18181B] rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 outline-none border border-white/10 focus:border-[#E50914]/40 focus:bg-[#1f1f23] transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-xs font-bold">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#18181B] rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 outline-none border border-white/10 focus:border-[#E50914]/40 focus:bg-[#1f1f23] transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-xs font-bold">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#18181B] rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 outline-none border border-white/10 focus:border-[#E50914]/40 focus:bg-[#1f1f23] transition-all resize-none"
                      placeholder="Type your message details here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#E50914] hover:bg-[#b8070f] text-white px-5 py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-[#E50914]/15 hover:shadow-[#E50914]/30 hover:scale-102 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
