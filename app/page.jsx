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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const Sidebar = (
    <aside className="w-[280px] shrink-0 bg-white border-l border-stone-200/80 flex flex-col h-[calc(100vh-73px)] sticky top-[73px]">
      <div className="px-5 pt-5 pb-3 border-b border-stone-100">
        <div className="text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#a16207]">Workspaces</div>
        <div className="font-display text-[19px] font-semibold text-stone-900 mt-1 leading-tight">תחומי עבודה</div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-stone-500">{cat.name}</div>
            <div className="space-y-0.5">
              {cat.modes.map((k) => {
                const active = mode === k;
                return (
                  <button
                    key={k}
                    onClick={() => { setMode(k); setSidebarOpen(false); }}
                    className={
                      "w-full text-right px-3 py-2 rounded-lg text-[14px] transition-all flex items-center gap-2 " +
                      (active
                        ? "bg-[#1e3a5f] text-white font-medium shadow-sm"
                        : "text-stone-700 hover:bg-stone-100 hover:text-[#1e3a5f]")
                    }
                  >
                    <span className={"w-1 h-1 rounded-full " + (active ? "bg-white" : "bg-stone-300")}></span>
                    {MODES[k].label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen paper-bg text-stone-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-stone-200 hover:bg-stone-50 transition text-stone-700"
              aria-label="תפריט"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0f1e33] flex items-center justify-center font-display text-lg font-semibold text-[#faf7f2] shadow-md ring-1 ring-stone-900/5">LY</div>
            <div>
              <div className="text-[17px] font-display font-semibold tracking-tight text-stone-900 leading-tight">Lital&apos;s Research Co-Pilot</div>
              <div className="text-[11.5px] text-stone-500 font-normal tracking-wide">Context-Informed Social Work · Fatherhood · Qualitative Research</div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs hover:border-stone-300 hover:bg-stone-50 transition text-stone-700 cursor-pointer"
            >
              <option value="he">עברית</option>
              <option value="en">English</option>
            </select>
            <button onClick={reset} className="text-xs bg-white hover:bg-stone-50 border border-stone-200 hover:border-stone-300 rounded-lg px-3 py-1.5 transition text-stone-700 font-medium">
              שיחה חדשה
            </button>
            <button
              onClick={() => { setKeyDraft(apiKey); setShowSettings(true); }}
              className={"text-xs rounded-lg px-3 py-1.5 border transition font-medium " + (apiKey ? "bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700" : "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800")}
            >
              {apiKey ? "מפתח API" : "הוסיפי מפתח API"}
            </button>
          </div>
        </div>
      </header>

      {showSettings && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-7 space-y-4 shadow-2xl ring-1 ring-stone-900/5" onClick={(e) => e.stopPropagation()}>
            <div className="text-xl font-display font-semibold text-stone-900">מפתח OpenAI</div>
            <div className="text-sm text-stone-600 leading-relaxed">
              הדביקי כאן את מפתח ה-API שלך (מתחיל ב-<code dir="ltr" className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 text-[12px]">sk-</code>).
              נשמר מקומית בדפדפן. להשגה:
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-[#1e3a5f] hover:text-[#0f1e33] underline underline-offset-2 mx-1 font-medium">platform.openai.com/api-keys</a>
            </div>
            <input
              dir="ltr"
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-[#1e3a5f] focus:bg-white font-mono text-sm transition"
              autoFocus
            />
            <div className="flex gap-2 justify-end pt-1">
              <button onClick={() => setShowSettings(false)} className="px-4 py-2 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-sm font-medium text-stone-700 transition">ביטול</button>
              <button onClick={saveKey} disabled={!keyDraft.trim()} className="px-5 py-2 rounded-lg bg-[#1e3a5f] hover:bg-[#0f1e33] disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-white transition shadow-sm">שמירה</button>
            </div>
            <div className="text-[11.5px] text-stone-500 pt-1">עלויות ה-API מחויבות ישירות לחשבון ה-OpenAI שלך.</div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 pt-5 pb-3 border-b border-stone-100 flex items-center justify-between">
              <div>
                <div className="text-[10.5px] font-medium tracking-[0.18em] uppercase text-[#a16207]">Workspaces</div>
                <div className="font-display text-[19px] font-semibold text-stone-900 mt-1 leading-tight">תחומי עבודה</div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav className="overflow-y-auto px-3 py-4 space-y-5 h-[calc(100vh-76px)]">
              {CATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <div className="px-3 mb-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-stone-500">{cat.name}</div>
                  <div className="space-y-0.5">
                    {cat.modes.map((k) => {
                      const active = mode === k;
                      return (
                        <button
                          key={k}
                          onClick={() => { setMode(k); setSidebarOpen(false); }}
                          className={
                            "w-full text-right px-3 py-2 rounded-lg text-[14px] transition-all flex items-center gap-2 " +
                            (active ? "bg-[#1e3a5f] text-white font-medium shadow-sm" : "text-stone-700 hover:bg-stone-100 hover:text-[#1e3a5f]")
                          }
                        >
                          <span className={"w-1 h-1 rounded-full " + (active ? "bg-white" : "bg-stone-300")}></span>
                          {MODES[k].label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto flex">
        <div className="hidden md:block">{Sidebar}</div>

        <main className="flex-1 min-w-0 px-6 py-8">
          <div className="max-w-3xl mx-auto">
            {empty && (
              <section className="pt-6 pb-4 text-center space-y-4">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#a16207] font-medium">Senior Academic Co-Pilot</div>
                <h1 className="font-display text-4xl md:text-[48px] font-medium text-stone-900 leading-[1.1]">
                  ברוכה הבאה, ד״ר ליטל
                </h1>
                <p className="text-stone-600 text-[15px] leading-relaxed max-w-2xl mx-auto">
                  שותף כתיבה ומחקר שמכיר את עולמך —
                  <span className="text-stone-800 font-medium"> Context-Informed Practice</span>,
                  אבהות לא-משמורנית, סיכון ועוני, מתודולוגיה איכותנית.
                </p>
              </section>
            )}

            <div className="bg-gradient-to-br from-[#1e3a5f]/[0.04] to-[#a16207]/[0.03] border border-[#1e3a5f]/15 rounded-xl px-5 py-4 my-6 leading-relaxed shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-1 self-stretch bg-[#1e3a5f]/40 rounded-full flex-shrink-0 mt-0.5"></div>
                <div className="flex-1">
                  <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#1e3a5f]/70 mb-1">{MODES[mode].label}</div>
                  <div className="text-[14px] text-stone-700">{MODES[mode].hint}</div>
                </div>
              </div>
            </div>

            {!empty && (
              <div ref={scrollerRef} className="space-y-6 mb-6">
                {messages.map((m, i) => (
                  <div key={i}>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-stone-500 mb-2 font-medium">
                      {m.role === "user" ? "את" : "Co-Pilot"}
                    </div>
                    <div
                      className={
                        "rounded-2xl px-6 py-4 border leading-relaxed whitespace-pre-wrap bubble " +
                        (m.role === "user"
                          ? "bg-white border-stone-200 text-stone-800 shadow-sm"
                          : "bg-[#1e3a5f]/[0.025] border-[#1e3a5f]/15 text-stone-800")
                      }
                    >
                      {m.content || (busy && i === messages.length - 1 ? "…" : "")}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow sticky bottom-4">
              {uploadedFile && (
                <div className="mb-3 text-[12px] text-[#1e3a5f] bg-[#1e3a5f]/[0.06] border border-[#1e3a5f]/20 rounded-lg px-3 py-1.5 inline-flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="font-medium">{uploadedFile}</span>
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
                  className="shrink-0 h-[50px] w-[50px] flex items-center justify-center bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 rounded-xl text-stone-500 hover:text-[#1e3a5f] transition disabled:opacity-40"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-stone-300 border-t-[#1e3a5f] rounded-full animate-spin"></div>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 17.98 8.8l-8.57 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  )}
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
                  className="flex-1 bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-[#1e3a5f] focus:bg-white resize-y transition text-[14.5px] leading-relaxed text-stone-800 placeholder:text-stone-400"
                />
                <button
                  onClick={send}
                  disabled={busy || !input.trim()}
                  className="h-[50px] bg-[#1e3a5f] hover:bg-[#0f1e33] disabled:bg-stone-300 disabled:cursor-not-allowed px-6 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all"
                >
                  {busy ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto"></div>
                  ) : (
                    "שליחה"
                  )}
                </button>
              </div>
              <div className="text-[11px] text-stone-400 text-center mt-3 tracking-wide">
                Cmd/Ctrl + Enter לשליחה · המפתח נשמר מקומית · PDF/DOCX/TXT עד 20MB
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
