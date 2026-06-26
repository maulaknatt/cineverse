"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  RefreshCw,
  Film,
  Loader2,
} from "lucide-react";
import { AI_PROMPT_EXAMPLES, MOOD_OPTIONS } from "@/constants/ai-prompts";
import { cn } from "@/utils/cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo! 👋 Aku **CineBot**, asisten AI untuk movie discovery. Ceritakan mood kamu, film favoritmu, atau tanyakan apa saja tentang film — dan aku akan memberikan rekomendasi terbaik!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "mood">("chat");
  const [moodRecommendations, setMoodRecommendations] = useState<unknown[]>([]);
  const [isMoodLoading, setIsMoodLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userInput = text || input.trim();
    if (!userInput || isLoading) return;

    setInput("");
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput, history }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "Maaf, terjadi kesalahan. Coba lagi.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodRecommendations = async (mood: string) => {
    setSelectedMood(mood);
    setIsMoodLoading(true);
    setMoodRecommendations([]);

    try {
      const res = await fetch("/api/ai/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });
      const data = await res.json();
      setMoodRecommendations(data.recommendations || []);
    } catch {
      setMoodRecommendations([]);
    } finally {
      setIsMoodLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat direset. Apa yang ingin kamu tonton hari ini? 🎬",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-4">
            <Sparkles className="w-4 h-4 text-[#E50914]" />
            <span className="text-sm font-medium text-[#E50914]">
              Powered by Gemini AI
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            CineBot — AI Movie Assistant
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Describe your mood, ask about movies, or get personalized recommendations
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex p-1 glass rounded-xl border border-white/10">
            {[
              { id: "chat", label: "AI Chat", icon: Sparkles },
              { id: "mood", label: "Mood Picks", icon: Film },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as "chat" | "mood")}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === id
                    ? "bg-[#E50914] text-white shadow-lg"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E50914] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">CineBot</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-[420px] overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-[#E50914]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-[#E50914] text-white rounded-tr-sm"
                            : "glass border border-white/10 text-zinc-200 rounded-tl-sm"
                        )}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E50914]/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
                    </div>
                    <div className="glass border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Examples */}
              <div className="px-4 py-2 border-t border-white/5">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {AI_PROMPT_EXAMPLES.slice(0, 5).map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => sendMessage(ex.prompt)}
                      className="shrink-0 text-xs px-3 py-1.5 glass rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all whitespace-nowrap"
                    >
                      {ex.emoji} {ex.prompt.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Tanyakan apa saja tentang film..."
                    rows={1}
                    className="flex-1 bg-[#27272A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none resize-none border border-white/10 focus:border-[#E50914]/40 transition-colors"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="w-12 h-12 rounded-xl bg-[#E50914] hover:bg-[#b20710] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mood Tab */}
        {activeTab === "mood" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold text-white text-center mb-6">
              How are you feeling right now?
            </h2>

            {/* Mood Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => getMoodRecommendations(mood.label)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                    selectedMood === mood.label
                      ? "border-[#E50914] bg-[#E50914]/10 scale-105"
                      : "glass border-white/10 hover:border-white/20 hover:scale-105"
                  )}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs font-medium text-white">{mood.label}</span>
                </button>
              ))}
            </div>

            {/* Mood Results */}
            {isMoodLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
                  <p className="text-zinc-400 text-sm">
                    CineBot is thinking...
                  </p>
                </div>
              </div>
            )}

            {!isMoodLoading && moodRecommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-base font-semibold text-white mb-4">
                  🎬 Recommended for your mood
                </h3>
                <div className="space-y-3">
                  {(moodRecommendations as Array<{title: string; year: number; reason: string; genre?: string; imdb_rating?: number}>).map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-xl border border-white/10 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl font-bold text-[#E50914]/50 w-8 text-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-white">
                              {rec.title}
                            </h4>
                            {rec.year && (
                              <span className="text-xs text-zinc-400">({rec.year})</span>
                            )}
                            {rec.imdb_rating && (
                              <span className="text-xs text-yellow-400">
                                ★ {rec.imdb_rating}
                              </span>
                            )}
                            {rec.genre && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                                {rec.genre}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">{rec.reason}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
