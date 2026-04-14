"use client";
import { useState, useRef, useEffect } from "react";

const MODES = {
  write: {
    label: "✍️ כתיבה",
    placeholder: "נושא הסעיף / פסקה / מאמר שאת רוצה לכתוב…",
    hint: "אכתוב טקסט אקדמי בסגנונך, מעוגן ב-context-informed practice ובספרות הקיימת.",
  },
  feedback: {
    label: "🔍 פידבק על טקסט",
    placeholder: "הדביקי כאן את הטקסט שלך לקבלת ביקורת עמיתים…",
    hint: "אעבור על הטקסט ואספק פידבק כמו reviewer 2 הוגן: בהירות טיעון, מסגרת תיאורטית, מתודולוגיה איכותנית, רפלקסיביות.",
  },
  edit: {
    label: "🪄 עריכה ושיפור",
    placeholder: "הדביקי טקסט לעריכה אקדמית (אנגלית/עברית)…",
    hint: "אשפר ניסוח, זרימה ודיוק לשוני אקדמי בלי לשנות משמעות. אסמן שינויים.",
  },
  brainstorm: {
    label: "💡 רעיונות מחקר",
    placeholder: "תארי תחום עניין, תופעה שראית בשטח, או שאלה פתוחה…",
    hint: "אציע שאלות מחקר, זוויות תיאורטיות וקישורים לספרות רלוונטית בתחומך.",
  },
  literature: {
    label: "📚 איתור ספרות",
    placeholder: "מושג / שאלה / טענה שאת מחפשת אליה ספרות…",
    hint: "אציע מקורות מרכזיים, מסגרות תיאורטיות ומחברות/ים שכדאי לצטט (לאימות ב-Google Scholar).",
  },
  outline: {
    label: "🧭 מבנה מאמר",
    placeholder: "תארי את המאמר: שאלת מחקר, שיטה, ממצאים עיקריים…",
    hint: "אבנה outline מלא לפי מבנה IMRaD איכותני המתאים לכתבי-עת בתחומך.",
  },
  abstract: {
    label: "📝 תקציר",
    placeholder: "הדביקי את המאמר או תיאור שלו לכתיבת abstract…",
    hint: "אנסח abstract של 150–250 מילים בסגנון המקובל ב-Child & Family Social Work / Men and Masculinities.",
  },
  cv: {
    label: "📄 CV אקדמי",
    placeholder: "הדביקי את קו״ח הנוכחיים / תיאור מיקום → אתאים אותם לתקן ספציפי…",
    hint: "מסייע בבניית CV אקדמי לתקן (tenure-track): structure, impact statements, teaching/service, grants, publications.",
  },
  jobtalk: {
    label: "🎤 Job Talk",
    placeholder: "תארי את המחקר שתרצי להציג (או שאלה ספציפית לגבי הטוק)…",
    hint: "מתכנן Job Talk של 45 דק׳: arc, hook, 3 takeaways, שקפים, timing, תשובות ל-Q&A צפוי.",
  },
  interview: {
    label: "🗣️ ראיון תקן",
    placeholder: "הזיני שאלה/תרחיש/ועדה → אציע תשובה מובנית…",
    hint: "אימון לשאלות ועדת חיפוש: research agenda, teaching philosophy, diversity statement, 5-year plan, fit.",
  },
  statement: {
    label: "📑 Research/Teaching Statement",
    placeholder: "תארי את המוסד, המחלקה, ומה מחפשים → אכתוב statement מותאם…",
    hint: "כתיבת Research Statement / Teaching Statement / Diversity Statement מותאמים לפוזיציה.",
  },
  grant: {
    label: "💰 Grant Proposal",
    placeholder: "תארי את הקרן (ISF / BSF / NIH R01 / Spencer) ואת הרעיון…",
    hint: "בונה specific aims, significance, innovation, approach, timeline — מותאם לקרן.",
  },
  cover: {
    label: "✉️ מכתב מועמדות",
    placeholder: "הדביקי את המודעה + פרטי המחלקה…",
    hint: "מכתב מועמדות (cover letter) ממוקד למוסד: fit, contribution, trajectory, 1-1.5 עמוד.",
  },
  scholar: {
    label: "🔎 חיפוש ספרות חי",
    placeholder: "הקלידי שאילתה מחקרית…",
    hint: "חיפוש חי ב-Google Scholar/PubMed עם סינתזה של 150 מילה וזיהוי פערים.",
  },
  journalfit: {
    label: "🎯 התאמת כתב-עת",
    placeholder: "הדביקי abstract / תיאור המאמר…",
    hint: "מדרג 5 כתבי-עת מתאימים (IF, scope, acceptance rate, time-to-decision) — עם לינקים.",
  },
  rebuttal: {
    label: "↩️ מענה לרוויורים",
    placeholder: "הדביקי את הערות הרוויורים + הטקסט שלך…",
    hint: "מכתב מענה point-by-point: נימוסי, ענייני, עם טקסט רוויזיה מוכן להעתקה.",
  },
  email: {
    label: "✉️ אימייל מקצועי",
    placeholder: "למי + על מה + מה ה-ask…",
    hint: "אימייל אקדמי קצר וממוקד (120–180 מילים) בסגנון מקצועי.",
  },
  networking: {
    label: "🤝 אאוטריץ׳",
    placeholder: "שם + מוסד + מה את רוצה ממנ/ה…",
    hint: "בודק ב-web_search את העבודה האחרונה שלהם ומכין אימייל מותאם אישית.",
  },
  syllabus: {
    label: "📘 סילבוס",
    placeholder: "נושא הקורס + רמה (MSW/PhD)…",
    hint: "סילבוס 13–15 שבועות עם קריאות מאומתות, מטלות, רובריקות ושילוב DEI.",
  },
  rigor: {
    label: "🔬 ביקורת מתודולוגיה",
    placeholder: "הדביקי את פרק המתודולוגיה שלך…",
    hint: "Stress-test לפרק איכותני: sampling, saturation, trustworthiness, reflexivity, ethics.",
  },
};

export default function Page() {
  const [mode, setMode] = useState("write");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [lang, setLang] = useState("he");
  const scrollerRef = useRef(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo(0, scrollerRef.current.scrollHeight);
  }, [messages]);

  async function send() {
    if (!input.trim() || busy) return;
    const userMsg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, mode, lang }),
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
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 px-4 py-3 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Lital&apos;s Research Co-Pilot</div>
          <div className="text-xs text-white/60">
            Context-Informed Social Work · Fatherhood · Risk · Poverty · Qualitative Research
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm"
          >
            <option value="he">עברית</option>
            <option value="en">English</option>
          </select>
          <button onClick={reset} className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded px-3 py-1">
            צ&apos;אט חדש
          </button>
        </div>
      </header>

      <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-white/10">
        {Object.entries(MODES).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            className={
              "text-sm px-3 py-1.5 rounded-full border " +
              (mode === k
                ? "bg-indigo-500/20 border-indigo-400 text-indigo-200"
                : "bg-white/5 border-white/10 hover:bg-white/10")
            }
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-2 text-xs text-white/60 border-b border-white/10">
        {MODES[mode].hint}
      </div>

      <main ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-white/50 text-sm max-w-2xl mx-auto mt-10 text-center">
            ברוכה הבאה ליטל. בחרי מצב עבודה למעלה והתחילי. כל ההקשר של תחום המחקר שלך
            (NEVET / context-informed practice, אבהות לא-משמורנית, סיכון בילדות, עוני, מתודולוגיה איכותנית)
            כבר טעון לתוך המודל.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={"max-w-3xl mx-auto " + (m.role === "user" ? "" : "")}>
            <div className="text-xs text-white/40 mb-1">
              {m.role === "user" ? "את" : "Co-Pilot"}
            </div>
            <div
              className={
                "bubble rounded-2xl px-4 py-3 border " +
                (m.role === "user"
                  ? "bg-indigo-500/10 border-indigo-500/30"
                  : "bg-white/5 border-white/10")
              }
            >
              {m.content || (busy && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
      </main>

      <footer className="border-t border-white/10 p-3">
        <div className="max-w-3xl mx-auto flex gap-2 items-end">
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
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 resize-y"
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 px-4 py-2 rounded-xl text-white font-medium"
          >
            {busy ? "…" : "שליחה"}
          </button>
        </div>
        <div className="text-[11px] text-white/40 text-center mt-2">
          Cmd/Ctrl + Enter לשליחה · המפתח של OpenAI מוגדר פעם אחת בשרת ועובד מכל מכשיר
        </div>
      </footer>
    </div>
  );
}
