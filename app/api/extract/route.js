export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file) return Response.json({ error: "no file" }, { status: 400 });

    const name = (file.name || "").toLowerCase();
    const buf = Buffer.from(await file.arrayBuffer());

    if (buf.length > 20 * 1024 * 1024) {
      return Response.json({ error: "file too large (max 20MB)" }, { status: 400 });
    }

    let text = "";

    if (name.endsWith(".txt") || name.endsWith(".md")) {
      text = buf.toString("utf8");
    } else if (name.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buf);
      text = data.text || "";
    } else if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer: buf });
      text = result.value || "";
    } else {
      return Response.json({ error: "unsupported file type. use .pdf/.docx/.txt/.md" }, { status: 400 });
    }

    text = text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (text.length > 120000) text = text.slice(0, 120000) + "\n\n[...truncated]";
    return Response.json({ text, filename: file.name, chars: text.length });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
