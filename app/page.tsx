"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  RefreshCw,
  Save,
  Settings,
  Download,
  X,
  Music,
  Plus,
  Trash2,
  Upload,
  FileText,
  Disc3,
} from "lucide-react";

const DEFAULT_LINKS = [
  {
    label: "Website",
    url: "https://www.josh-wilkins.com",
    note: "Main portfolio — mixing, mastering, drumming",
  },
  {
    label: "Bandcamp — Warts N' All",
    url: "https://glassmantra.bandcamp.com/album/warts-n-all-live-in-london",
    note: "For drumming / live performance roles",
  },
  {
    label: "Spotify",
    url: "https://open.spotify.com/album/33S2Ah3pPuknBdnec7BHM5",
    note: "Recorded work — engineering and drumming",
  },
];

const STORAGE_KEYS = {
  cv: "studio-j:cv",
  links: "studio-j:links",
};

const JOB_TYPES = [
  { key: "auto", label: "Auto", sub: "Let the desk pick" },
  { key: "session", label: "Session", sub: "Drumming, recording" },
  { key: "engineering", label: "Studio", sub: "Mix, master, produce" },
  { key: "teaching", label: "Teaching", sub: "Tuition, schools" },
  { key: "industry", label: "Industry", sub: "Label, A&R" },
];

const SAMPLE_CV = `JOSH WILKINS
Drummer · Producer · Mixing & Mastering Engineer
London, UK · josh-wilkins.com

PROFILE
Session drummer and studio engineer with a decade of experience across live performance, studio tracking, mixing and mastering. Home studio based in East London. Comfortable across rock, indie, ambient, jazz-adjacent, and electronic production. Member of Glass Mantra (released Warts N' All: Live in London, 2023).

EXPERIENCE

Freelance Drummer, Producer & Engineer — 2018 to present
- Tracked drums for over 40 independent releases across rock, indie, and ambient genres
- Mixed and mastered Glass Mantra's live album Warts N' All, released on Bandcamp and Spotify
- Regular session work at The Pool Studios and Urchin Studios, London
- Built and run a home studio centred on a Korg MR-2000S, UAD Apollo, and a modest outboard chain

Drummer — Glass Mantra, 2019 to present
- Performed at venues including The Lexington, Corsica Studios, and Strongroom
- Co-wrote and tracked drums for the band's full catalogue

Drum Tutor — Private practice, 2016 to present
- Teach students aged 12 to adult, beginner through grade 8

EDUCATION
BA (Hons) Music Production, University of Westminster — 2015 to 2018

SKILLS
- DAWs: Pro Tools, Logic Pro, Ableton Live
- Mixing: analogue summing, parallel compression, bus processing`;

const SAMPLE_JD = `Studio Mix Engineer — Permanent, London

We are a busy independent recording studio in Hackney seeking a Mix Engineer to join our in-house team. The role involves mixing a range of projects: indie bands, singer-songwriters, podcasts, and occasional commercial work.

Responsibilities:
- Mix 3 to 5 projects per week to a high standard
- Work closely with our tracking engineers and producers
- Liaise directly with clients on revisions and deliverables

Requirements:
- Minimum 3 years professional mixing experience
- Deep knowledge of Pro Tools; working familiarity with Logic Pro
- Strong ears, particularly for drum and vocal balance
- Portfolio demonstrating mixes across multiple genres

Desirable:
- Background as a musician
- Experience with live album mixing
- Mastering skills`;

const REVISION_PRESETS = [
  { key: "shorter", label: "Shorter", sub: "Tighten it up", instruction: "Cut this letter down to roughly 200-250 words. Keep the strongest specifics, lose anything generic or repetitive. Same voice, same structure, just tighter." },
  { key: "longer", label: "Longer", sub: "More detail", instruction: "Expand this letter to roughly 400-480 words. Add more concrete detail drawn from the CV. Do not invent anything not in the CV. Keep the voice and structure." },
  { key: "mixing", label: "More on mixing", sub: "Lead with engineering", instruction: "Rewrite so mixing and engineering craft lead the letter. Emphasise technical detail, specific sessions, approach to tone and balance. Push drumming or other angles into the background." },
  { key: "drumming", label: "More on drumming", sub: "Lead with playing", instruction: "Rewrite so drumming and performance lead the letter. Emphasise feel, reading ability, live experience, adaptability across styles. Push engineering into the background." },
  { key: "warmer", label: "Warmer", sub: "More personal", instruction: "Make the tone a touch warmer and more human. Still professional and British, still no clichés, but let a bit more personality show. Do not become sales-y or try-hard." },
  { key: "colder", label: "More formal", sub: "Cooler register", instruction: "Make this letter more formal and measured. Still concrete, still no filler, but slightly cooler register appropriate for institutional or corporate contexts." },
  { key: "punchier", label: "Punchier", sub: "Sharper second line", instruction: "Keep the opening line standard (stating the role), but sharpen the SECOND sentence so it hooks the reader with a specific, concrete connection to the role. Strengthen the closing." },
  { key: "redo", label: "Fresh take", sub: "Different angle", instruction: "Rewrite this letter with a genuinely different angle or opening. Keep the same facts from the CV but approach the match to the job from a new direction." },
];

const GREETINGS = [
  { heading: "Welcome back, Josh.", sub: "Let's make something good." },
  { heading: "Morning, Josh.", sub: "Studio's warm. Ready when you are." },
  { heading: "Alright Josh.", sub: "Another one. Let's get you the gig." },
  { heading: "Hey Josh.", sub: "Tape's threaded. Levels set. Let's go." },
  { heading: "Back in the room, Josh.", sub: "What are we working on today?" },
  { heading: "Good to see you, Josh.", sub: "Right. What's the brief?" },
  { heading: "Hello mate.", sub: "Kettle's on. Let's have a look at this one." },
  { heading: "Hi gorgeous.", sub: "You've got this. Drop the brief in." },
  { heading: "Ey up, Josh.", sub: "Let's cut something sharp." },
  { heading: "Oi oi.", sub: "Josh Wilkins, reporting for duty. What's the job?" },
  { heading: "Josh, my man.", sub: "Another day, another letter. Let's nail it." },
  { heading: "Hello you.", sub: "Studio's all yours. Take your time." },
  { heading: "Josh!", sub: "Right on time. What are we going after?" },
  { heading: "Alright trouble.", sub: "Let's have it then." },
  { heading: "Welcome in, Josh.", sub: "Pull up a stool. What's the gig?" },
  { heading: "How do, Josh.", sub: "Fresh tape, fresh start. Let's go." },
  { heading: "Hiya Josh.", sub: "Good to have you back. Let's get stuck in." },
  { heading: "Evening, Josh.", sub: "Late session? Let's make it count." },
  { heading: "Yo Josh.", sub: "Lined up and ready. Hit me." },
  { heading: "Hello lovely.", sub: "You're in the right place. Let's write you a good one." },
];

export default function StudioJ() {
  const [cv, setCv] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [jobType, setJobType] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [detectedType, setDetectedType] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFilename, setUploadedFilename] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [customTweak, setCustomTweak] = useState("");
  const [revisionCount, setRevisionCount] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [greeting] = useState(() => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);

  useEffect(() => {
    try {
      const cvVal = localStorage.getItem(STORAGE_KEYS.cv);
      if (cvVal) setCv(cvVal);
    } catch {}
    try {
      const linksVal = localStorage.getItem(STORAGE_KEYS.links);
      if (linksVal) setLinks(JSON.parse(linksVal));
      else setLinks(DEFAULT_LINKS);
    } catch {
      setLinks(DEFAULT_LINKS);
    }
    setStorageLoaded(true);
  }, []);

  const saveProfile = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.cv, cv);
      localStorage.setItem(STORAGE_KEYS.links, JSON.stringify(links));
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
    } catch {
      setError("Couldn't save. Try again.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const name = file.name.toLowerCase();
      let text = "";

      if (name.endsWith(".docx")) {
        // Load mammoth from CDN — more reliable than bundling
        const w = window as any;
        if (!w.mammoth) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load mammoth.js"));
            document.head.appendChild(script);
          });
        }
        const arrayBuffer = await file.arrayBuffer();
        const result = await w.mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (name.endsWith(".pdf")) {
        const w = window as any;
        if (!w.pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load pdf.js"));
            document.head.appendChild(script);
          });
          w.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await w.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageTexts: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pageTexts.push(content.items.map((item: any) => item.str).join(" "));
        }
        text = pageTexts.join("\n\n");
      } else if (name.endsWith(".txt") || name.endsWith(".md")) {
        text = await file.text();
      } else {
        setError("Unsupported file. Use .pdf, .docx, or .txt.");
        setUploading(false);
        return;
      }

      text = text.replace(/\n{3,}/g, "\n\n").trim();
      if (text.length < 50) {
        setError("Couldn't extract much from that file. Try pasting instead.");
      } else {
        setCv(text);
        setUploadedFilename(file.name);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(`Couldn't read that file. ${err?.message || "Try a different format or paste the text."}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1800);
    } catch {}
  };

  const generate = async () => {
    setError("");
    setResult(null);
    setDetectedType(null);
    if (cv.trim().length < 50) { setError("Add your CV in Profile first."); return; }
    if (jobDesc.trim().length < 50) { setError("Paste a fuller job description."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, jobDesc, links, jobType }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }
      const parsed = await response.json();
      setResult(parsed);
      setDetectedType(parsed.detectedType);
      setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
    setDetectedType(null);
    setRevisionCount(0);
    setCustomTweak("");
  };

  const regenerateLetter = async (presetKey: string, customInstruction: string | null = null) => {
    if (!result?.coverLetter) return;
    setError("");
    setRegenerating(presetKey);
    const instruction = customInstruction || REVISION_PRESETS.find((p) => p.key === presetKey)?.instruction;
    if (!instruction) { setRegenerating(null); return; }
    try {
      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter: result.coverLetter, cv, jobDesc, instruction }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Revision failed. Try again.");
        setRegenerating(null);
        return;
      }
      const parsed = await response.json();
      if (parsed.coverLetter) {
        setResult((prev: any) => ({ ...prev, coverLetter: parsed.coverLetter }));
        setRevisionCount((n) => n + 1);
        if (customInstruction) setCustomTweak("");
      } else {
        setError("Revision came back empty. Try again.");
      }
    } catch {
      setError("Revision failed. Try again.");
    } finally {
      setRegenerating(null);
    }
  };

  const handleCustomTweak = () => { if (!customTweak.trim()) return; regenerateLetter("custom", customTweak.trim()); };

  const downloadDocx = () => {
    if (!result?.coverLetter) return;
    const paragraphs = result.coverLetter.split(/\n+/).map((p: string) =>
      `<w:p><w:pPr><w:spacing w:after="200"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">${escapeXml(p)}</w:t></w:r></w:p>`
    ).join("");
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}</w:body></w:document>`;
    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
    const blob = createZipBlob([
      { name: "[Content_Types].xml", content: contentTypesXml },
      { name: "_rels/.rels", content: relsXml },
      { name: "word/document.xml", content: documentXml },
    ]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `josh-wilkins-cover-letter-${Date.now()}.docx`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addLink = () => setLinks((prev) => [...prev, { label: "", url: "", note: "" }]);
  const updateLink = (i: number, field: string, val: string) => setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)));
  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, idx) => idx !== i));

  const typeBadge = detectedType ? JOB_TYPES.find((t) => t.key === detectedType)?.label || detectedType : null;

  return (
    <div className="min-h-screen w-full" style={{ background: "#ffffff", fontFamily: "Fraunces, serif", color: "#1a1612" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .mono { font-family: 'JetBrains Mono', monospace; }
        .serif { font-family: 'Fraunces', serif; }
        .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E"); pointer-events: none; }
        .rule { height: 1px; background: #1a1612; opacity: 0.25; }
        .rule-thick { height: 3px; background: #1a1612; }
        textarea, input[type="text"], input[type="url"] { background: transparent; border: none; outline: none; resize: none; width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 15px; line-height: 1.7; color: #1a1612; }
        textarea { min-height: 100px; }
        textarea::placeholder, input::placeholder { color: #8a7e6a; font-style: italic; }
        .mode-btn { transition: all 0.2s ease; cursor: pointer; }
        .mode-btn:hover { transform: translateY(-1px); }
        .primary-btn { transition: all 0.2s ease; cursor: pointer; }
        .primary-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 6px 6px 0 #1a1612; }
        .primary-btn:active:not(:disabled) { transform: translateY(0); box-shadow: 2px 2px 0 #1a1612; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .icon-btn { transition: all 0.15s ease; cursor: pointer; }
        .icon-btn:hover { background: #1a1612; color: #f5efe4; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .stagger-1 { animation-delay: 0.05s; opacity: 0; }
        .stagger-2 { animation-delay: 0.15s; opacity: 0; }
        .drawer-backdrop { animation: fadeIn 0.2s ease; }
        .drawer-panel { animation: slideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>

      <div className="fixed inset-0 grain opacity-30 pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16">
        <header className="mb-10 fade-up stagger-1">
          <div className="flex items-baseline justify-between mono text-[11px] tracking-[0.2em] uppercase opacity-60 mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Disc3 size={13} />
              <span>Studio J · For Josh Wilkins</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a href="https://www.josh-wilkins.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-70" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>josh-wilkins.com</a>
              <span className="opacity-40">·</span>
              <a href="https://glassmantra.bandcamp.com/album/warts-n-all-live-in-london" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-70" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Bandcamp</a>
              <span className="opacity-40">·</span>
              <a href="https://open.spotify.com/album/33S2Ah3pPuknBdnec7BHM5" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-70" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Spotify</a>
              <button onClick={() => setSettingsOpen(true)} className="icon-btn px-3 py-1.5 flex items-center gap-2 ml-1" style={{ border: "1.5px solid #1a1612" }}>
                <Settings size={12} /><span>Profile</span>
              </button>
            </div>
          </div>
          <div className="rule-thick mb-4" />

          <div className="mono text-[11px] tracking-[0.25em] uppercase opacity-50 mb-3">{greeting.heading}</div>

          <h1 className="serif leading-[0.92] tracking-tight" style={{ fontSize: "clamp(48px, 8vw, 104px)", fontWeight: 300 }}>
            <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Studio</span> <em style={{ fontWeight: 400 }}>J</em>
          </h1>
          <div className="rule mt-6" />
          <p className="mt-5 max-w-2xl text-[15px] md:text-[17px] leading-relaxed serif italic" style={{ fontWeight: 400, color: "#5a4d3c" }}>
            {greeting.sub}
          </p>
          <p className="mt-3 max-w-2xl text-[14px] md:text-[15px] leading-relaxed" style={{ fontWeight: 400 }}>
            Paste a job description. The desk drafts a cover letter in your voice, with CV recommendations and rewritten bullets tailored to the role. British English, no filler, no em-dashes.
          </p>
        </header>

        {storageLoaded && cv.trim().length < 50 && jobDesc.trim().length >= 50 && !result && (
          <div className="mb-6 p-5 fade-up stagger-2 flex items-start justify-between gap-4" style={{ background: "#fbf7ee", border: "1.5px solid #1a1612" }}>
            <div>
              <div className="mono text-[10px] tracking-[0.2em] uppercase opacity-60 mb-1">Sound check</div>
              <div className="serif" style={{ fontSize: 17, fontWeight: 500 }}>Load your CV in Profile, Josh. Once it's in, it stays.</div>
            </div>
            <button onClick={() => setSettingsOpen(true)} className="primary-btn mono text-[11px] tracking-[0.15em] uppercase px-4 py-2.5 whitespace-nowrap" style={{ background: "#1a1612", color: "#f5efe4", boxShadow: "3px 3px 0 #1a1612" }}>Load in</button>
          </div>
        )}

        {!result && (
          <div className="fade-up stagger-2">
            {cv.trim().length < 50 && jobDesc.trim().length < 50 && (
              <div className="p-4 mb-5 flex items-center justify-between gap-3" style={{ background: "#fbf7ee", border: "1.5px dashed #1a1612" }}>
                <div className="mono text-[12px] opacity-75">Just browsing? Load a sample CV and a mix-engineer job to see it in action.</div>
                <button onClick={() => { setCv(SAMPLE_CV); setJobDesc(SAMPLE_JD); setJobType("auto"); }} className="icon-btn mono text-[10px] tracking-[0.15em] uppercase px-3 py-2 whitespace-nowrap" style={{ border: "1.5px solid #1a1612" }}>Load demo</button>
              </div>
            )}

            <div className="mb-6">
              <div className="mono text-[11px] tracking-[0.2em] uppercase opacity-60 mb-3">01 — Role type</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {JOB_TYPES.map((t) => {
                  const active = jobType === t.key;
                  return (
                    <button key={t.key} onClick={() => setJobType(t.key)} className="mode-btn text-left p-3" style={{ background: active ? "#1a1612" : "transparent", color: active ? "#f5efe4" : "#1a1612", border: "1.5px solid #1a1612" }}>
                      <div className="serif" style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{t.label}</div>
                      <div className="mono text-[10px] mt-1 opacity-75 leading-tight">{t.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="mono text-[11px] tracking-[0.2em] uppercase opacity-60">02 — Paste job description</div>
                <div className="mono text-[11px] opacity-50">{jobDesc.length} chars</div>
              </div>
              <div className="p-5" style={{ background: "#fbf7ee", border: "1.5px solid #1a1612", minHeight: 320 }}>
                <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the full job posting — role, responsibilities, requirements, company blurb…" rows={14} />
              </div>
            </div>

            {error && <div className="mono text-[12px] p-3 mb-4" style={{ background: "#f5d9c4", border: "1.5px solid #9a3b1a", color: "#6b2a12" }}>{error}</div>}

            <button onClick={generate} disabled={loading} className="primary-btn w-full flex items-center justify-center gap-3 py-5" style={{ background: "#1a1612", color: "#f5efe4", border: "1.5px solid #1a1612", boxShadow: "4px 4px 0 #1a1612" }}>
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /><span className="serif" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Composing...</span></>
              ) : (
                <><Sparkles size={18} /><span className="serif" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>Generate application</span><ArrowRight size={18} /></>
              )}
            </button>
          </div>
        )}

        {result && (
          <div ref={resultsRef} className="fade-up stagger-1">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 mono text-[11px] tracking-[0.2em] uppercase opacity-60">
                <span>Draft</span>
                {typeBadge && <span className="px-2 py-1" style={{ background: "#1a1612", color: "#f5efe4", letterSpacing: "0.15em" }}>{typeBadge}</span>}
                {revisionCount > 0 && <span className="opacity-75">Take {revisionCount + 1}</span>}
              </div>
              <button onClick={reset} className="mono text-[11px] tracking-[0.15em] uppercase flex items-center gap-2 hover:opacity-60"><RefreshCw size={12} /> Start over</button>
            </div>

            <section className="mb-10">
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                <h2 className="serif" style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}><em style={{ fontWeight: 400 }}>i.</em> Cover Letter</h2>
                <div className="flex gap-2">
                  <button onClick={downloadDocx} className="icon-btn mono text-[11px] tracking-[0.15em] uppercase flex items-center gap-2 px-3 py-2" style={{ border: "1.5px solid #1a1612" }}><Download size={12} /> .docx</button>
                  <button onClick={() => copyToClipboard(result.coverLetter, "letter")} className="icon-btn mono text-[11px] tracking-[0.15em] uppercase flex items-center gap-2 px-3 py-2" style={{ border: "1.5px solid #1a1612" }}>{copiedKey === "letter" ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}</button>
                </div>
              </div>
              <div className="rule mb-4" />
              <div className="p-6 md:p-8 serif whitespace-pre-wrap" style={{ background: "#fbf7ee", border: "1.5px solid #1a1612", fontSize: 16, lineHeight: 1.75, fontWeight: 400 }}>{result.coverLetter}</div>
            </section>

            <section className="mb-10">
              <h2 className="serif mb-3" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}><em style={{ fontWeight: 400 }}>Not quite right?</em></h2>
              <div className="rule mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {REVISION_PRESETS.map((preset) => {
                  const busy = regenerating === preset.key;
                  const anyBusy = regenerating !== null;
                  return (
                    <button key={preset.key} onClick={() => regenerateLetter(preset.key)} disabled={anyBusy} className="mode-btn text-left p-3" style={{ background: busy ? "#1a1612" : "transparent", color: busy ? "#f5efe4" : "#1a1612", border: "1.5px solid #1a1612", opacity: anyBusy && !busy ? 0.4 : 1, cursor: anyBusy ? "wait" : "pointer" }}>
                      <div className="flex items-center gap-2">
                        {busy && <Loader2 size={11} className="animate-spin" />}
                        <div className="serif" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{preset.label}</div>
                      </div>
                      <div className="mono text-[10px] mt-1 opacity-75 leading-tight">{preset.sub}</div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 p-3" style={{ background: "#fbf7ee", border: "1.5px solid #1a1612" }}>
                  <input type="text" value={customTweak} onChange={(e) => setCustomTweak(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !regenerating && customTweak.trim()) handleCustomTweak(); }} placeholder="Or write your own tweak: 'mention the Korg more', 'less about live work'…" />
                </div>
                <button onClick={handleCustomTweak} disabled={!!regenerating || !customTweak.trim()} className="icon-btn mono text-[11px] tracking-[0.15em] uppercase px-4 flex items-center gap-2" style={{ border: "1.5px solid #1a1612", opacity: !customTweak.trim() || regenerating ? 0.4 : 1, cursor: regenerating ? "wait" : customTweak.trim() ? "pointer" : "not-allowed" }}>
                  {regenerating === "custom" ? <><Loader2 size={11} className="animate-spin" />Cutting</> : <><Sparkles size={11} />Apply</>}
                </button>
              </div>
            </section>

            <section className="mb-10">
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="serif" style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}><em style={{ fontWeight: 400 }}>ii.</em> CV Recommendations</h2>
                <button onClick={() => copyToClipboard(result.cvRecommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join("\n\n"), "recs")} className="icon-btn mono text-[11px] tracking-[0.15em] uppercase flex items-center gap-2 px-3 py-2" style={{ border: "1.5px solid #1a1612" }}>{copiedKey === "recs" ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}</button>
              </div>
              <div className="rule mb-4" />
              <ol className="space-y-4">
                {result.cvRecommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex gap-5">
                    <span className="mono flex-shrink-0" style={{ fontSize: 11, letterSpacing: "0.1em", opacity: 0.5, paddingTop: 4, minWidth: 28 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="serif" style={{ fontSize: 16, lineHeight: 1.7, fontWeight: 400 }}>{rec}</span>
                  </li>
                ))}
              </ol>
            </section>

            {result.bulletRewrites && result.bulletRewrites.length > 0 && (
              <section className="mb-10">
                <h2 className="serif mb-3" style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}><em style={{ fontWeight: 400 }}>iii.</em> Bullet Rewrites</h2>
                <div className="rule mb-4" />
                <div className="space-y-6">
                  {result.bulletRewrites.map((b: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2" style={{ border: "1.5px solid #1a1612" }}>
                      <div className="p-5" style={{ background: "#f0e7d4", borderRight: "1.5px solid #1a1612" }}>
                        <div className="mono text-[10px] tracking-[0.2em] uppercase opacity-60 mb-2">Before</div>
                        <div className="mono" style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{b.original}</div>
                      </div>
                      <div className="p-5" style={{ background: "#fbf7ee" }}>
                        <div className="mono text-[10px] tracking-[0.2em] uppercase opacity-60 mb-2">After</div>
                        <div className="serif" style={{ fontSize: 15, lineHeight: 1.65, fontWeight: 500 }}>{b.rewritten}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <footer className="mt-16 pt-6" style={{ borderTop: "1px solid rgba(26,22,18,0.2)" }}>
          <div className="mono text-[10px] tracking-[0.2em] uppercase opacity-50 flex justify-between flex-wrap gap-2">
            <span>Studio J · Built for Josh · Powered by Claude</span>
            <span>A first pass, never a replacement for your own ear</span>
          </div>
        </footer>
      </div>

      {settingsOpen && (
        <div className="drawer-backdrop fixed inset-0 z-40" style={{ background: "rgba(26,22,18,0.4)" }} onClick={() => setSettingsOpen(false)}>
          <div className="drawer-panel absolute right-0 top-0 bottom-0 w-full md:w-[640px] overflow-y-auto" style={{ background: "#ffffff", borderLeft: "1.5px solid #1a1612" }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="mono text-[11px] tracking-[0.2em] uppercase opacity-60 mb-1">Your stems</div>
                  <h2 className="serif" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>CV & Credits</h2>
                </div>
                <button onClick={() => setSettingsOpen(false)} className="icon-btn p-2" style={{ border: "1.5px solid #1a1612" }}><X size={16} /></button>
              </div>
              <div className="rule-thick mb-6" />

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="mono text-[11px] tracking-[0.2em] uppercase opacity-60">CV</label>
                  <div className="flex items-center gap-3">
                    {uploadedFilename && <div className="mono text-[10px] opacity-60 flex items-center gap-1.5"><FileText size={11} /><span className="truncate max-w-[140px]">{uploadedFilename}</span></div>}
                    <div className="mono text-[11px] opacity-50">{cv.length} chars</div>
                  </div>
                </div>

                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.md" onChange={handleFileUpload} style={{ display: "none" }} />

                <div className="flex gap-2 mb-2">
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="icon-btn mono text-[11px] tracking-[0.15em] uppercase flex items-center gap-2 px-3 py-2 flex-1 justify-center" style={{ border: "1.5px solid #1a1612", opacity: uploading ? 0.6 : 1, cursor: uploading ? "wait" : "pointer" }}>
                    {uploading ? <><Loader2 size={12} className="animate-spin" /> Reading...</> : <><Upload size={12} /> Upload PDF / DOCX</>}
                  </button>
                  {cv && <button onClick={() => { setCv(""); setUploadedFilename(""); }} className="icon-btn mono text-[11px] tracking-[0.15em] uppercase flex items-center gap-2 px-3 py-2" style={{ border: "1.5px solid #1a1612" }} title="Clear CV"><Trash2 size={12} /></button>}
                </div>

                <div className="p-5" style={{ background: "#fbf7ee", border: "1.5px solid #1a1612", minHeight: 400 }}>
                  <textarea value={cv} onChange={(e) => { setCv(e.target.value); if (uploadedFilename) setUploadedFilename(""); }} placeholder="Upload a file above, or paste your full CV — experience, credits, education, skills, gear, DAWs, etc." rows={18} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="mono text-[11px] tracking-[0.2em] uppercase opacity-60">Credits & links</label>
                  <button onClick={addLink} className="icon-btn mono text-[10px] tracking-[0.15em] uppercase flex items-center gap-1.5 px-2.5 py-1.5" style={{ border: "1.5px solid #1a1612" }}><Plus size={11} /> Add</button>
                </div>
                {links.length === 0 && <div className="p-4 mono text-[12px] opacity-60 italic" style={{ background: "#fbf7ee", border: "1.5px solid rgba(26,22,18,0.3)" }}>Bandcamp, Spotify, SoundCloud, specific credits, website, etc. The app picks the one most relevant to each role.</div>}
                <div className="space-y-3">
                  {links.map((link, i) => (
                    <div key={i} className="p-3 space-y-2" style={{ background: "#fbf7ee", border: "1.5px solid #1a1612" }}>
                      <div className="flex items-center gap-2">
                        <Music size={13} className="opacity-60 flex-shrink-0" />
                        <input type="text" value={link.label} onChange={(e) => updateLink(i, "label", e.target.value)} placeholder="Label (e.g. Bandcamp, Warts N' All)" style={{ flex: 1 }} />
                        <button onClick={() => removeLink(i)} className="icon-btn p-1.5 flex-shrink-0" style={{ border: "1px solid #1a1612" }}><Trash2 size={11} /></button>
                      </div>
                      <input type="url" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} placeholder="https://..." />
                      <input type="text" value={link.note} onChange={(e) => updateLink(i, "note", e.target.value)} placeholder="When to use this (e.g. 'for mixing roles', 'drumming demo')" />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveProfile} className="primary-btn w-full flex items-center justify-center gap-3 py-4" style={{ background: savedFlash ? "#2d5a3d" : "#1a1612", color: "#f5efe4", border: `1.5px solid ${savedFlash ? "#2d5a3d" : "#1a1612"}`, boxShadow: "4px 4px 0 #1a1612" }}>
                {savedFlash ? <><Check size={16} /><span className="serif" style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>Saved</span></> : <><Save size={16} /><span className="serif" style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>Save profile</span></>}
              </button>

              <div className="mono text-[10px] tracking-[0.15em] uppercase opacity-50 mt-4 text-center">Stored privately in your browser</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function escapeXml(s: string) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function createZipBlob(files: { name: string; content: string }[]) {
  const encoder = new TextEncoder();
  const fileRecords: Uint8Array[] = [];
  const centralRecords: Uint8Array[] = [];
  let offset = 0;
  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
    return table;
  })();
  const crc32 = (bytes: Uint8Array) => {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const contentBytes = encoder.encode(file.content);
    const crc = crc32(contentBytes);
    const size = contentBytes.length;
    const localHeader = new ArrayBuffer(30 + nameBytes.length);
    const lhView = new DataView(localHeader);
    const lhBytes = new Uint8Array(localHeader);
    lhView.setUint32(0, 0x04034b50, true); lhView.setUint16(4, 20, true); lhView.setUint16(6, 0, true); lhView.setUint16(8, 0, true); lhView.setUint16(10, 0, true); lhView.setUint16(12, 0, true);
    lhView.setUint32(14, crc, true); lhView.setUint32(18, size, true); lhView.setUint32(22, size, true); lhView.setUint16(26, nameBytes.length, true); lhView.setUint16(28, 0, true);
    lhBytes.set(nameBytes, 30);
    const centralHeader = new ArrayBuffer(46 + nameBytes.length);
    const chView = new DataView(centralHeader);
    const chBytes = new Uint8Array(centralHeader);
    chView.setUint32(0, 0x02014b50, true); chView.setUint16(4, 20, true); chView.setUint16(6, 20, true); chView.setUint16(8, 0, true); chView.setUint16(10, 0, true); chView.setUint16(12, 0, true); chView.setUint16(14, 0, true);
    chView.setUint32(16, crc, true); chView.setUint32(20, size, true); chView.setUint32(24, size, true); chView.setUint16(28, nameBytes.length, true); chView.setUint16(30, 0, true); chView.setUint16(32, 0, true); chView.setUint16(34, 0, true); chView.setUint16(36, 0, true); chView.setUint32(38, 0, true); chView.setUint32(42, offset, true);
    chBytes.set(nameBytes, 46);
    fileRecords.push(lhBytes); fileRecords.push(contentBytes); centralRecords.push(chBytes);
    offset += lhBytes.length + contentBytes.length;
  }
  const centralSize = centralRecords.reduce((a, b) => a + b.length, 0);
  const centralOffset = offset;
  const eocd = new ArrayBuffer(22);
  const eocdView = new DataView(eocd);
  eocdView.setUint32(0, 0x06054b50, true); eocdView.setUint16(4, 0, true); eocdView.setUint16(6, 0, true); eocdView.setUint16(8, files.length, true); eocdView.setUint16(10, files.length, true); eocdView.setUint32(12, centralSize, true); eocdView.setUint32(16, centralOffset, true); eocdView.setUint16(20, 0, true);
  const parts = [...fileRecords, ...centralRecords, new Uint8Array(eocd)];
  return new Blob(parts, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
