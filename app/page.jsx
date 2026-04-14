"use client";
import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  { name: "כתיבה ומחקר", modes: ["write", "feedback", "edit", "brainstorm", "literature", "scholar", "rigor"] },
  { name: "פרסום", modes: ["outline", "abstract", "journalfit", "rebuttal"] },
  { name: "קריירה", modes: ["cv", "jobtalk", "interview", "statement", "cover"] },
  { name: "מימון והוראה", modes: ["grant", "syllabus"] },
  { name: "תקשורת", modes: ["email", "networking"] },
];

const MODES = {
  write: { label: "כתיבה", placeholder: "נושא הסעיף / פסקה / מאמר שאת רוצה לכתוב…", hint: "אכתוב טקסט אקדמי בסגנונך, מעוגן ב-context-informed practice ובספרות הקיימת." },
  feedback: { label: "פידבק על טקסט", placeholder: "הדביקי כאן את הטקסט שלך לקבלת ביקורת עמיתים…", hint: "אעבור על הטקסט ואספק פידבק כמו reviewer 2 הוגן: בהירות טיעון, מסגרת תיאורטית, מתודולוגיה איכותנית, רפלקסיביות." },
  edit: { label: "עריכה ושיפור", placeholder: "הדביקי טקסט לעריכה אקדמית (אנגלית/עברית)…", hint: "אשפר ניסוח, זרימה ודיוק לשוני אקדמי בלי לשנות משמעות. אסמן שינויים." },
  brainstorm: { label: "רעיונות מחקר", placeholder: "תארי תחום עניין, תופעה שראית בשטח, או שאלה פתוחה…", hint: "אציע שאלות מחקר, זוויות תיאורטיות וקישורים לספרות רלוונטית בתחומך." },
  literature: { label: "איתור ספרות", placeholder: "מושג / שאלה / טענה שאת מחפשת אליה ספרות…", hint: "אציע מקורות מרכזיים, מסגרות תיאורטיות ומחברות/ים שכדאי לצטט (לאימות ב-Google Scholar)." },
  outline: { label: "מבנה מאמר", placeholder: "תארי את המאמר: שאלת מחקר, שיטה, ממצאים עיקריים…", hint: "אבנה outline מלא לפי מבנה IMRaD איכותני המתאים לכתבי-עת בתחומך." },
  abstract: { label: "תקציר", placeholder: "הדביקי את המאמר או תיאור שלו לכתיבת abstract…", hint: "אנסח abstract של 150–250 מילים בסגנון המקובל ב-Child & Family Social Work / Men and Masculinities." },
  cv: { label: "CV אקדמי", placeholder: "הדביקי את קו״ח הנוכחיים / תיאור מיקום → אתאים אותם לתקן ספציפי…", hint: "מסייע בבניית CV אקדמי לתקן (tenure-track): structure, impact statements, teaching/service, grants, publications." },
  jobtalk: { label: "Job Talk", placeholder: "תארי את המחקר שתרצי להציג (או שאלה ספציפית לגבי הטוק)…", hint: "מתכנן Job Talk של 45 דק׳: arc, hook, 3 takeaways, שקפים, timing, תשובות ל-Q&A צפוי." },
  interview: { label: "ראיון תקן", placeholder: "הזיני שאלה/תרחיש/ועדה → אציע תשובה מובנית…", hint: "אימון לשאלות ועדת חיפוש: research agenda, teaching philosophy, diversity statement, 5-year plan, fit." },
  statement: { label: "Research/Teaching Statement", placeholder: "תארי את המוסד, המחלקה, ומה מחפשים → אכתוב statement מותאם…", hint: "כתיבת Research Statement / Teaching Statement / Diversity Statement מותאמים לפוזיציה." },
  grant: { label: "Grant Proposal", placeholder: "תארי את הקרן (ISF / BSF / NIH R01 / Spencer) ואת הרעיון…", hint: "בונה specific aims, significance, innovation, approach, timeline — מותאם לקרן." },
  cover: { label: "מכתב מועמדות", placeholder: "הדביקי את המודעה + פרטי המחלקה…", hint: "מכתב מועמדות (cover letter) ממוקד למוסד: fit, contribution, trajectory, 1-1.5 עמוד." },
  scholar: { label: "חיפוש ספרות חי", placeholder: "הקלידי שאילתה מחקרית…", hint: "חיפוש חי ב-Google Scholar/PubMed עם סינתזה של 150 מילה וזיהוי פערים." },
  journalfit: { label: "התאמת כתב-עת", placeholder: "הדביקי abstract / תיאור המאמר — או העלי קובץ PDF/DOCX של המאמר…", hint: "דרגי 5–7 כתבי-עת מתאימים (scope, IF, acceptance rate, time-to-decision) עם נימוק לכל אחד. אפשר להעלות את המאמר המלא." },
  rebuttal: { label: "מענה לרוויורים", placeholder: "הדביקי את הערות הרוויורים + הטקסט שלך…", hint: "מכתב מענה point-by-point: נימוסי, ענייני, עם טקסט רוויזיה מוכן להעתקה." },
  email: { label: "אימייל מקצועי", placeholder: "למי + על מה + מה ה-ask…", hint: "אימייל אקדמי קצר וממוקד (120–180 מילים) בסגנון מקצועי." },
  networking: { label: "אאוטריץ׳", placeholder: "שם + מוסד + מה את רוצה ממנ/ה…", hint: "בודק ב-web_search את העבודה האחרונה שלהם ומכין אימייל מותאם אישית." },
  syllabus: { label: "סילבוס", placeholder: "נושא הקורס + רמה (MSW/PhD)…", hint: "סילבוס 13–15 שבועות עם קריאות מאומתות, מטלות, רובריקות ושילוב DEI." },
  rigor: { label: "ביקורת מתודולוגיה", placeholder: "הדביקי את פרק המתודולוגיה שלך…", hint: "Stress-test לפרק איכותני: sampling, saturation, trustworthiness, reflexivity, ethics." },
};

export default function Page() {
  const [mode, setMode] = useState("write");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState("he");
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [keyDraft, setKeyDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const scrollerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo(0, scrollerRef.current.scrollHeight);
  }, [messages]);

  useEffect(() => {
    try {
      const k = localStorage.getItem("openai_api_key") || "";
      setApiKey(k);
      setKeyDraft(k);
    } catch {}
  }, []);

  function saveKey() {
    try { localStorage.setItem("openai_api_key", keyDraft.trim()); } catch {}
    setApiKey(keyDraft.trim());
    setShowSettings(false);
  }

  async function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    setUploadedFile(f.name);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const data = await res.json();
      if (data.text) {
        setInput((prev) => (prev ? prev + "\n\n" : "") + data.text);
        if (mode !== "journalfit" && mode !== "abstract" && mode !== "feedback" && mode !== "edit") {
          setMode("journalfit");
        }
      } else {
        alert("שגיאה בחילוץ טקסט: " + (data.error || "unknown"));
      }
    } catch (err) {
      alert("שגיאה בהעלאה: " + String(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function send() {
    if (!input.trim() || busy) return;
    const userMsg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setUploadedFile("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, mode, lang, apiKey }),
      });
      if (!res.ok || !res.body) {
        const t = await res.text();
        setMessages((m) => {
          const c = [...m];
          c[c.length - 1] = { role: "assistant", content: "שגיאה: " + t };
          return c;
        });
        setBusy(false);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => {
          const c = [...m];
          c[c.length - 1] = { role: "assistant", content: acc };
          return c;
        });
      }
    } catch (e) {
      setMessages((m) => {
        const c = [...m];
        c[c.length - 1] = { role: "assistant", content: "שגיאה: " + String(e) };
        return c;
      });
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setMessages([]);
    setInput("");
    setUploadedFile("");
  }

  const empty = messages.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0d1a] via-[#0d1020] to-[#0a0c18] text-slate-100">
      <header className="border-b border-white/5 backdrop-blur-sm bg-white/[0.02] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center font-serif text-base font-semibold text-white shadow-lg shadow-indigo-500/20">LY</div>
            <div>
              <div className="text-lg font-serif font-semibold tracking-tight">Lital&apos;s Research Co-Pilot</div>
              <div className="text-[11px] text-slate-400 font-light">Context-Informed Social Work · Fatherhood · Qualitative Research</div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-xs hover:bg-white/[0.08] transition"
            >
              <option value="he">עברית</option>
              <option value="en">English</option>
            </select>
            <button onClick={reset} className="text-xs bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg px-3 py-1 transition">
              שיחה חדשה
            </button>
            <button
              onClick={() => { setKeyDraft(apiKey); setShowSettings(true); }}
              className={"text-xs rounded-lg px-3 py-1 border transition " + (apiKey ? "bg-white/[0.04] hover:bg-white/[0.08] border-white/10" : "bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/50 text-amber-200")}
            >
              מפתח API
            </button>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-[#111425] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-serif font-semibold">מפתח OpenAI</div>
            <div className="text-sm text-slate-300 leading-relaxed">
              הדביקי כאן את מפתח ה-API שלך (מתחיל ב-<code dir="ltr" className="bg-white/5 px-1 rounded">sk-</code>).
              נשמר מקומית בדפדפן. להשגה:
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-indigo-200 underline mx-1">platform.openai.com/api-keys</a>
            </div>
            <input
              dir="ltr"
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-400 font-mono text-sm"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm transition">ביטול</button>
              <button onClick={saveKey} disabled={!keyDraft.trim()} className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-sm font-medium transition">שמירה</button>
            </div>
            <div className="text-[11px] text-slate-500">עלויות ה-API מחויבות ישירות לחשבון ה-OpenAI שלך.</div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 pb-8">
        {empty && (
          <section className="pt-8 pb-6 text-center space-y-3">
            <div className="text-3xl font-serif font-medium text-slate-100">ברוכה הבאה, ליטל</div>
            <div className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
              בחרי תחום עבודה למטה, הדביקי טקסט או העלי מאמר. כל ההקשר של תחום המחקר שלך
              (NEVET · context-informed practice · אבהות לא-משמורנית · סיכון בילדות · עוני · מתודולוגיה איכותנית)
              כבר טעון למודל.
            </div>
          </section>
        )}

        {empty && (
          <section className="mb-5">
            <div className="text-[11px] font-medium tracking-wider text-slate-500 mb-3 text-center uppercase">בחרי תחום עבודה</div>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="flex flex-wrap gap-2 items-center justify-end">
                  <div className="flex flex-wrap gap-1.5 justify-end flex-1">
                    {cat.modes.map((k) => (
                      <button
                        key={k}
                        onClick={() => setMode(k)}
                        className={
                          "text-[13px] px-3 py-1.5 rounded-full border transition-all " +
                          (mode === k
                            ? "bg-indigo-500/25 border-indigo-400/60 text-indigo-100 shadow-sm shadow-indigo-500/20"
                            : "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:border-white/20")
                        }
                      >
                        {MODES[k].label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] font-medium tracking-wider text-slate-500 w-28 shrink-0 text-right" dir="rtl">{cat.name}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!empty && (
          <div className="sticky top-[60px] z-20 -mx-6 px-6 py-2 bg-[#0b0d1a]/80 backdrop-blur-sm border-b border-white/5">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {Object.keys(MODES).map((k) => (
                <button
                  key={k}
                  onClick={() => setMode(k)}
                  className={
                    "text-[12px] px-2.5 py-1 rounded-full border transition-all " +
                    (mode === k
                      ? "bg-indigo-500/25 border-indigo-400/60 text-indigo-100"
                      : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08]")
                  }
                >
                  {MODES[k].label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-[13px] text-slate-300 bg-indigo-500/[0.06] border border-indigo-400/20 rounded-xl px-4 py-2.5 my-4 leading-relaxed">
          <span className="text-indigo-300 font-medium">{MODES[mode].label}:</span> {MODES[mode].hint}
        </div>

        {!empty && (
          <main ref={scrollerRef} className="space-y-5 mb-5">
            {messages.map((m, i) => (
              <div key={i}>
                <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
                  {m.role === "user" ? "את" : "Co-Pilot"}
                </div>
                <div
                  className={
                    "rounded-2xl px-5 py-3.5 border leading-relaxed whitespace-pre-wrap " +
                    (m.role === "user"
                      ? "bg-indigo-500/10 border-indigo-400/25 text-slate-100"
                      : "bg-white/[0.03] border-white/10 text-slate-200")
                  }
                >
                  {m.content || (busy && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </main>
        )}

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 shadow-lg shadow-black/20">
          {uploadedFile && (
            <div className="mb-2 text-[12px] text-indigo-300 bg-indigo-500/10 border border-indigo-400/20 rounded-lg px-3 py-1.5 inline-block">
              קובץ הועלה: {uploadedFile}
            </div>
          )}
          <div className="flex gap-2 items-end">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="העלי מאמר (PDF/DOCX/TXT)"
              className="shrink-0 h-[46px] px-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl text-slate-300 text-sm transition disabled:opacity-40"
            >
              {uploading ? "…" : "העלאת מאמר"}
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={MODES[mode].placeholder}
              rows={3}
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-400/60 focus:bg-white/[0.06] resize-y transition text-[14px] leading-relaxed"
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              className="h-[46px] bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/20 transition"
            >
              {busy ? "…" : "שליחה"}
            </button>
          </div>
          <div className="text-[11px] text-slate-500 text-center mt-2">
            Cmd/Ctrl + Enter לשליחה · המפתח נשמר מקומית · PDF/DOCX/TXT עד 20MB
          </div>
        </div>
      </div>
    </div>
  );
}
