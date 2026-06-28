import { NextRequest, NextResponse } from "next/server";
import { getGeminiFlash } from "@/services/gemini/client";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Please sign in to chat with CineBot!" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, isPro: true, aiQueryCount: true, lastAiQueryAt: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "USER_NOT_FOUND", message: "User profile not found." },
        { status: 404 }
      );
    }

    // Rate Limiting Logic for Free users
    if (!user.isPro) {
      const now = new Date();
      let count = user.aiQueryCount;
      const lastQuery = user.lastAiQueryAt;

      // Reset count if it's a new day
      const isNewDay = !lastQuery || new Date(lastQuery).toDateString() !== now.toDateString();
      if (isNewDay) {
        count = 0;
      }

      if (count >= 5) {
        return NextResponse.json({
          error: "FREE_LIMIT_REACHED",
          message: "You have reached your daily limit of 5 free AI queries. Upgrade to PRO for unlimited chats!",
        }, { status: 403 });
      }

      // Update count
      await prisma.user.update({
        where: { id: user.id },
        data: {
          aiQueryCount: count + 1,
          lastAiQueryAt: now,
        },
      });
    }

    const { prompt, history = [] } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = getGeminiFlash();

    // Filter history so it starts with a user message (Gemini API requirement)
    const firstUserMsgIndex = history.findIndex((msg: { role: string }) => msg.role === "user");
    const validHistory = firstUserMsgIndex !== -1 ? history.slice(firstUserMsgIndex) : [];

    // Start chat with history
    const chat = model.startChat({
      history: validHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
