import OpenAI from "openai";
import prompts from "./prompts.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      "OPENAI_API_KEY is not set on the server. Add it in Vercel -> Project -> Settings -> Environment Variables.",
      { status: 500 }
    );
  }
  let body;
  try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
  const { messages = [], mode = "write", lang = "he" } = body;

  const langDirective = lang === "he"
    ? "Respond in Hebrew unless the user explicitly wrote in English. Keep technical terms in English in parentheses on first use."
    : "Respond in English.";

  const modePrompt = prompts.modes[mode] || prompts.modes.write;
  const instructions = [
    prompts.context,
    modePrompt,
    langDirective,
    "Before finalizing, ask yourself: did I use web_search when factual/up-to-date info was needed? If not, search now."
  ].join("\n\n");

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const input = messages.map((m) => ({
    role: m.role,
    content: [{ type: m.role === "assistant" ? "output_text" : "input_text", text: m.content }]
  }));

  try {
    const stream = await client.responses.create({
      model,
      instructions,
      input,
      tools: [{ type: "web_search_preview" }],
      tool_choice: "auto",
      stream: true,
      temperature: 0.6
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "response.output_text.delta" && event.delta) {
              controller.enqueue(encoder.encode(event.delta));
            } else if (event.type === "response.web_search_call.in_progress") {
              controller.enqueue(encoder.encode("\n[searching the web...]\n"));
            } else if (event.type === "response.error") {
              controller.enqueue(encoder.encode("\n[error] " + (event.error?.message || "")));
            }
          }
        } catch (e) {
          controller.enqueue(encoder.encode("\n[stream error] " + String(e)));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no"
      }
    });
  } catch (e) {
    try {
      const chat = await client.chat.completions.create({
        model,
        stream: true,
        temperature: 0.6,
        messages: [{ role: "system", content: instructions }, ...messages]
      });
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const part of chat) {
              const t = part.choices?.[0]?.delta?.content || "";
              if (t) controller.enqueue(encoder.encode(t));
            }
          } finally { controller.close(); }
        }
      });
      return new Response(readable, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    } catch (e2) {
      return new Response("OpenAI error: " + (e2?.message || String(e2)), { status: 500 });
    }
  }
}
