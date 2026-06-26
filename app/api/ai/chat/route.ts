import { NextRequest, NextResponse } from "next/server";
import { getGeminiFlash } from "@/services/gemini/client";

export async function POST(req: NextRequest) {
  try {
    const { prompt, history = [] } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = getGeminiFlash();

    // Start chat with history
    const chat = model.startChat({
      history: history.map((msg: { role: string; content: string }) => ({
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
