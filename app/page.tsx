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
  Radio,
  Disc3,
  Mic,
} from "lucide-react";
import * as mammoth from "mammoth";

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
  { key: "session", label: "Session", sub: "Drumming · recording dates" },
  { key: "engineering", label: "Studio", sub: "Mix · master · produce" },
  { key: "teaching", label: "Teaching", sub: "Tuition · schools" },
  { key: "industry", label: "Industry", sub: "Label · publishing · A&R" },
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
- Deliver stems, rough mixes, and mastered masters on tight turnarounds for independent artists

Drummer — Glass Mantra, 2019 to present
- Performed at venues including The Lexington, Corsica Studios, and Strongroom
- Co-wrote and tracked drums for the band's full catalogue
- Handled in-ear monitoring set-up and front-of-house liaison on tour dates

Drum Tutor — Private practice, 2016 to present
- Teach students aged 12 to adult, beginner through grade 8
- Prepare students for Rockschool and Trinity graded exams
- Clean pass rate on all grade submissions to date

EDUCATION
BA (Hons) Music Production, University of Westminster — 2015 to 2018

SKILLS
- DAWs: Pro Tools, Logic Pro, Ableton Live
- Mixing: analogue summing, parallel compression, bus processing
- Mastering: Izotope Ozone, FabFilter Pro-Q, hardware limiting
- Reading: chart reading, click work, overdub discipline`;

const SAMPLE_JD = `Studio Mix Engineer — Permanent, London

We are a busy independent recording studio in Hackney seeking a Mix Engineer to join our in-house team. The role involves mixing a range of projects for our clients: indie bands, singer-songwriters, podcasts, and occasional commercial work.

Responsibilities:
- Mix 3 to 5 projects per week to a high standard, from stems through to final delivery
- Work closely with our tracking engineers and producers to realise the artist's vision
- Liaise directly with clients on revisions and deliverables

Requirements:
- Minimum 3 years professional mixing experience
- Deep knowledge of Pro Tools; working familiarity with Logic Pro
- Strong ears, particularly for drum and vocal balance in dense arrangements
- Portfolio demonstrating mixes across multiple genres

Desirable:
- Background as a musician
- Experience with live album mixing or live-to-two-track sessions
- Mastering skills`;

const REVISION_PRESETS = [
  {
    key: "shorter",
    label: "Shorter",
    sub: "Tighten it up",
    instruction:
      "Cut this letter down to roughly 200-250 words. Keep the strongest specifics, lose anything generic or repetitive. Same voice, same structure, just tighter.",
  },
  {
    key: "longer",
    label: "Longer",
    sub: "More detail",
    instruction:
      "Expand this letter to roughly 400-480 words. Add more concrete detail drawn from the CV (specific credits, projects, or techniques that match the brief). Do not invent anything not in the CV. Keep the voice and structure.",
  },
  {
    key: "mixing",
    label: "More on mixing",
    sub: "Lead with engineering",
    instruction:
      "Rewrite so mixing and engineering craft lead the letter. Emphasise technical detail, specific sessions, approach to tone and balance. Push drumming or other angles into the background.",
  },
  {
    key: "drumming",
    label: "More on drumming",
    sub: "Lead with playing",
    instruction:
      "Rewrite so drumming and performance lead the letter. Emphasise feel, reading ability, live experience, adaptability across styles. Push engineering into the background.",
  },
  {
    key: "warmer",
    label: "Warmer",
    sub: "A little more personal",
    instruction:
      "Make the tone a touch warmer and more human. Still professional and British, still no clichés, but let a bit more personality show. Do not become sales-y or try-hard.",
  },
  {
    key: "colder",
    label: "More formal",
    sub: "Cooler, more corporate",
    instruction:
      "Make this letter more formal and measured. Still concrete, still no filler, but slightly cooler register appropriate for institutional or corporate contexts.",
  },
  {
    key: "punchier",
    label: "Punchier",
    sub: "Sharper second line, harder close",
    instruction:
      "Keep the opening line standard (stating the role), but sharpen the SECOND sentence so it hooks the reader with a specific, concrete connection to the role. Strengthen the closing so it ends with confidence rather than politeness. Middle can stay largely the same.",
  },
  {
    key: "redo",
    label: "Fresh take",
    sub: "Try a different angle",
    instruction:
      "Rewrite this letter with a genuinely different angle or opening. Keep the same facts from the CV but approach the match to the job from a new direction.",
  },
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

  const [greeting] = useState(
    () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
  );

  useEffect(() => {
    try {
      const cvVal = localStorage.getItem(STORAGE_KEYS.cv);
      if (cvVal) setCv(cvVal);
    } catch {}
    try {
      const linksVal = localStorage.getItem(STORAGE_KEYS.links);
      if (linksVal) {
        setLinks(JSON.parse(linksVal));
      } else {
        setLinks(DEFAULT_LINKS);
      }
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
    } catch (e) {
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
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (name.endsWith(".pdf")) {
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.head.appendChild(script);
          });
          (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pageTexts: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          pageTexts.push(pageText);
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
    } catch (err) {
      setError("Couldn't read that file. Try a different format or paste the text.");
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
    if (cv.trim().length < 50) {
      setError("Load your CV in the console first.");
      return;
    }
    if (jobDesc.trim().length < 50) {
      setError("Paste a fuller job description.");
      return;
    }
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
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (e) {
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

    const instruction =
      customInstruction ||
      REVISION_PRESETS.find((p) => p.key === presetKey)?.instruction;
    if (!instruction) {
      setRegenerating(null);
      return;
    }

    try {
      const response = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverLetter: result.coverLetter,
          cv,
          jobDesc,
          instruction,
        }),
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
    } catch (e) {
      setError("Revision failed. Try again.");
    } finally {
      setRegenerating(null);
    }
  };

  const handleCustomTweak = () => {
    if (!customTweak.trim()) return;
    regenerateLetter("custom", customTweak.trim());
  };

  const downloadDocx = () => {
    if (!result?.coverLetter) return;
    const paragraphs = result.coverLetter
      .split(/\n+/)
      .map(
        (p: string) =>
          `<w:p><w:pPr><w:spacing w:after="200"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">${escapeXml(p)}</w:t></w:r></w:p>`
      )
      .join("");

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${paragraphs}</w:body>
</w:document>`;

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const files = [
      { name: "[Content_Types].xml", content: contentTypesXml },
      { name: "_rels/.rels", content: relsXml },
      { name: "word/document.xml", content: documentXml },
    ];

    const blob = createZipBlob(files);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `josh-wilkins-cover-letter-${Date.now()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addLink = () => setLinks((prev) => [...prev, { label: "", url: "", note: "" }]);
  const updateLink = (i: number, field: string, val: string) =>
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: val } : l)));
  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, idx) => idx !== i));

  const typeBadge = detectedType
    ? JOB_TYPES.find((t) => t.key === detectedType)?.label || detectedType
    : null;

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: "#0e0c0a",
        fontFamily: "'Space Grotesk', sans-serif",
        color: "#e8e0d2",
      }}
    >
      <style jsx global>{`
        .display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .serif { font-family: 'Instrument Serif', serif; }
        .sans { font-family: 'Space Grotesk', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .led { background: radial-gradient(circle at 30% 30%, #ffb347 0%, #e8841a 40%, #8a3f0a 80%); box-shadow: 0 0 12px rgba(232, 132, 26, 0.6), 0 0 4px rgba(255, 179, 71, 0.8); }
        .led-green { background: radial-gradient(circle at 30% 30%, #7fffb0 0%, #22c55e 40%, #0a5f26 80%); box-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
        .led-red { background: radial-gradient(circle at 30% 30%, #ff9999 0%, #ef4444 40%, #7a1616 80%); box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
        @keyframes pulse-led { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .pulse { animation: pulse-led 1.6s ease-in-out infinite; }
        .grain::before { content: ''; position: fixed; inset: 0; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E"); opacity: 0.08; mix-blend-mode: overlay; z-index: 1; }
        .scanlines::after { content: ''; position: fixed; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255, 255, 255, 0.015) 2px, rgba(255, 255, 255, 0.015) 3px); z-index: 1; }
        .panel { background: linear-gradient(180deg, #1a1612 0%, #15110d 100%); border: 1px solid #2a2420; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.6); }
        .panel-warm { background: linear-gradient(180deg, #241c14 0%, #1a130c 100%); border: 1px solid #3a2e22; box-shadow: inset 0 1px 0 rgba(255, 179, 71, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.5); }
        .engraved { color: #9a8a74; text-shadow: 0 1px 0 rgba(0, 0, 0, 0.8), 0 -1px 0 rgba(255, 255, 255, 0.04); }
        textarea, input[type="text"], input[type="url"] { background: transparent; border: none; outline: none; resize: none; width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.7; color: #e8e0d2; }
        textarea::placeholder, input::placeholder { color: #6a5f4e; font-style: italic; }
        .track-btn { transition: all 0.2s ease; cursor: pointer; position: relative; }
        .track-btn:hover { transform: translateY(-1px); border-color: #e8841a !important; }
        .track-btn-active { background: linear-gradient(180deg, #2a1f14 0%, #1a130c 100%) !important; border-color: #e8841a !important; box-shadow: inset 0 0 0 1px rgba(232, 132, 26, 0.3), 0 0 20px rgba(232, 132, 26, 0.15); }
        .record-btn { transition: all 0.2s ease; cursor: pointer; position: relative; overflow: hidden; background: linear-gradient(180deg, #e8841a 0%, #b85c0a 100%); color: #0e0c0a; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.3), 0 4px 0 #6b3506, 0 6px 20px rgba(232, 132, 26, 0.4); }
        .record-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.3), 0 5px 0 #6b3506, 0 8px 24px rgba(232, 132, 26, 0.5); }
        .record-btn:active:not(:disabled) { transform: translateY(3px); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.3), 0 1px 0 #6b3506, 0 2px 10px rgba(232, 132, 26, 0.3); }
        .record-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ghost-btn { transition: all 0.15s ease; cursor: pointer; background: transparent; border: 1px solid #3a2e22; color: #c8b89a; }
        .ghost-btn:hover { background: #1a1612; border-color: #e8841a; color: #ffb347; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        .d-1 { animation-delay: 0.05s; } .d-2 { animation-delay: 0.15s; } .d-3 { animation-delay: 0.25s; }
        @keyframes vu { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        .vu-bar { transform-origin: bottom; animation: vu 0.8s ease-in-out infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 2s linear infinite; }
        .drawer-backdrop { animation: fadeIn 0.2s ease; }
        .drawer-panel { animation: slideIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .link-u { color: #c8b89a; text-decoration: underline; text-decoration-color: rgba(232, 132, 26, 0.4); text-underline-offset: 3px; transition: color 0.15s ease; }
        .link-u:hover { color: #ffb347; }
      `}</style>

      <div className="grain scanlines" />
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 15% 0%, rgba(232, 132, 26, 0.08) 0%, transparent 60%)", zIndex: 2 }} />

      <div className="relative max-w-5xl mx-auto px-5 md:px-10 py-8 md:py-12" style={{ zIndex: 10 }}>
        <div className="flex items-center justify-between mb-8 fade-up d-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Disc3 size={20} className="text-[#e8841a]" />
              <div className="display text-[#e8e0d2] text-[28px] leading-none tracking-[0.15em]">
                STUDIO <span className="text-[#e8841a]">J</span>
              </div>
            </div>
            <div className="hidden md:block h-6 w-px bg-[#3a2e22] mx-1" />
            <div className="hidden md:block mono text-[10px] tracking-[0.2em] uppercase engraved">Cover letters · cut to fit</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mono text-[10px] tracking-[0.2em] uppercase engraved">
              <div className="w-2 h-2 rounded-full led-green pulse" />
              <span>On air</span>
            </div>
            <button onClick={() => setSettingsOpen(true)} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase px-3 py-2 flex items-center gap-2">
              <Settings size={11} /><span>Console</span>
            </button>
          </div>
        </div>

        <div className="panel-warm p-8 md:p-12 mb-8 fade-up d-2 relative overflow-hidden" style={{ borderRadius: 2 }}>
          <div className="absolute top-6 right-6 flex items-end gap-1 h-10 opacity-60">
            {[0.3, 0.6, 0.9, 0.7, 1, 0.8, 0.5, 0.3].map((h, i) => (
              <div key={i} className="vu-bar w-1" style={{ height: `${h * 100}%`, background: i > 5 ? "#ef4444" : i > 3 ? "#ffb347" : "#22c55e", animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
          <div className="mono text-[10px] tracking-[0.3em] uppercase text-[#e8841a] mb-3 flex items-center gap-2">
            <Mic size={11} /><span>Now Recording · Session for Josh Wilkins</span>
          </div>
          <h1 className="display mb-3" style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 0.95, color: "#f5ead6" }}>{greeting.heading}</h1>
          <p className="serif italic max-w-2xl" style={{ fontSize: "clamp(20px, 2.2vw, 26px)", lineHeight: 1.4, color: "#c8b89a" }}>{greeting.sub}</p>
          <div className="mt-6 pt-6 border-t border-[#3a2e22] flex flex-wrap items-center gap-x-5 gap-y-2 mono text-[11px] tracking-[0.15em] uppercase">
            <span className="text-[#9a8a74]">Signal chain →</span>
            <a href="https://www.josh-wilkins.com" target="_blank" rel="noopener noreferrer" className="link-u">josh-wilkins.com</a>
            <a href="https://glassmantra.bandcamp.com/album/warts-n-all-live-in-london" target="_blank" rel="noopener noreferrer" className="link-u">Bandcamp</a>
            <a href="https://open.spotify.com/album/33S2Ah3pPuknBdnec7BHM5" target="_blank" rel="noopener noreferrer" className="link-u">Spotify</a>
          </div>
        </div>

        {storageLoaded && cv.trim().length < 50 && jobDesc.trim().length >= 50 && !result && (
          <div className="panel p-5 mb-6 fade-up d-3 flex items-start justify-between gap-4" style={{ borderRadius: 2 }}>
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full led mt-1.5 flex-shrink-0" />
              <div>
                <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a] mb-1">Input offline</div>
                <div className="sans text-[15px]" style={{ color: "#e8e0d2" }}>Load your CV into the console, Josh. Upload a file or paste the text.</div>
              </div>
            </div>
            <button onClick={() => setSettingsOpen(true)} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase px-4 py-2.5 whitespace-nowrap">Open console</button>
          </div>
        )}

        {!result && (
          <div className="fade-up d-3">
            {cv.trim().length < 50 && jobDesc.trim().length < 50 && (
              <div className="p-4 mb-5 flex items-center justify-between gap-3" style={{ background: "#15110d", border: "1px dashed #3a2e22", borderRadius: 2 }}>
                <div className="flex items-center gap-3">
                  <Disc3 size={14} className="text-[#9a8a74] flex-shrink-0" />
                  <div className="sans text-[13px]" style={{ color: "#c8b89a" }}>Just browsing? Load a sample CV and a mix-engineer job to see it in action.</div>
                </div>
                <button onClick={() => { setCv(SAMPLE_CV); setJobDesc(SAMPLE_JD); setJobType("auto"); }} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 whitespace-nowrap">Load demo</button>
              </div>
            )}

            <div className="panel p-6 md:p-7 mb-5" style={{ borderRadius: 2 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a]">Track 01</div>
                <div className="flex-1 h-px bg-[#3a2e22]" />
                <div className="mono text-[10px] tracking-[0.2em] uppercase engraved">Input routing</div>
              </div>
              <div className="display text-[22px] mb-1" style={{ color: "#f5ead6", letterSpacing: "0.05em" }}>What kind of gig?</div>
              <div className="sans text-[13px] mb-4" style={{ color: "#9a8a74" }}>Pick the channel, or let the desk route it automatically.</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {JOB_TYPES.map((t) => {
                  const active = jobType === t.key;
                  return (
                    <button key={t.key} onClick={() => setJobType(t.key)} className={`track-btn text-left p-3 ${active ? "track-btn-active" : ""}`} style={{ background: "#15110d", border: "1px solid #2a2420", borderRadius: 2 }}>
                      <div className="display text-[18px]" style={{ color: active ? "#ffb347" : "#e8e0d2", letterSpacing: "0.04em" }}>{t.label}</div>
                      <div className="mono text-[9px] mt-1 uppercase tracking-[0.1em]" style={{ color: active ? "#c8b89a" : "#6a5f4e" }}>{t.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="panel p-6 md:p-7 mb-6" style={{ borderRadius: 2 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a]">Track 02</div>
                <div className="flex-1 h-px bg-[#3a2e22]" />
                <div className="mono text-[10px] tracking-[0.2em] uppercase engraved">{jobDesc.length} chars</div>
              </div>
              <div className="display text-[22px] mb-1" style={{ color: "#f5ead6", letterSpacing: "0.05em" }}>Drop the brief</div>
              <div className="sans text-[13px] mb-4" style={{ color: "#9a8a74" }}>Paste the full job posting. More detail, better cut.</div>
              <div className="p-4" style={{ background: "#0a0806", border: "1px solid #2a2420", minHeight: 220, borderRadius: 2 }}>
                <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the JD here — role, responsibilities, requirements, company blurb. The lot." rows={11} />
              </div>
            </div>

            {error && (
              <div className="mono text-[12px] p-4 mb-5 flex items-center gap-3" style={{ background: "#2a0f0a", border: "1px solid #7a2617", color: "#ff9999", borderRadius: 2 }}>
                <div className="w-2 h-2 rounded-full led-red pulse flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button onClick={generate} disabled={loading} className="record-btn w-full flex items-center justify-center gap-3 py-6" style={{ borderRadius: 2 }}>
              {loading ? (
                <><Disc3 size={22} className="spin-slow" /><span className="display text-[26px] tracking-[0.1em]">Tape rolling...</span></>
              ) : (
                <><div className="w-3 h-3 rounded-full bg-[#0e0c0a] pulse" /><span className="display text-[26px] tracking-[0.1em]">Record take</span><ArrowRight size={20} /></>
              )}
            </button>
          </div>
        )}

        {result && (
          <div ref={resultsRef} className="fade-up d-1">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full led-green pulse" />
                <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#22c55e]">Playback ready</div>
                {typeBadge && <div className="mono text-[10px] tracking-[0.2em] uppercase px-2 py-1" style={{ background: "#1a1612", border: "1px solid #e8841a", color: "#ffb347" }}>{typeBadge}</div>}
              </div>
              <button onClick={reset} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase px-3 py-2 flex items-center gap-2"><RefreshCw size={11} /> New take</button>
            </div>

            <section className="panel p-6 md:p-8 mb-5" style={{ borderRadius: 2 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a]">A-side</div>
                <div className="flex-1 h-px bg-[#3a2e22]" />
                <div className="flex gap-2">
                  <button onClick={downloadDocx} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex items-center gap-2"><Download size={11} /> .docx</button>
                  <button onClick={() => copyToClipboard(result.coverLetter, "letter")} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex items-center gap-2">{copiedKey === "letter" ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}</button>
                </div>
              </div>
              <div className="display text-[28px] mb-1" style={{ color: "#f5ead6", letterSpacing: "0.04em" }}>The Letter</div>
              <div className="mono text-[11px] mb-5 uppercase tracking-[0.15em]" style={{ color: "#9a8a74" }}>Main track · ready to send</div>
              <div className="p-6 md:p-7 serif whitespace-pre-wrap" style={{ background: "#f5ead6", color: "#1a1612", fontSize: 17, lineHeight: 1.75, borderRadius: 2 }}>{result.coverLetter}</div>
            </section>

            <section className="panel p-6 md:p-8 mb-5" style={{ borderRadius: 2 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a]">Remix bay</div>
                <div className="flex-1 h-px bg-[#3a2e22]" />
                {revisionCount > 0 && <div className="mono text-[10px] tracking-[0.2em] uppercase engraved">Take {revisionCount + 1}</div>}
              </div>
              <div className="display text-[28px] mb-1" style={{ color: "#f5ead6", letterSpacing: "0.04em" }}>Not quite right?</div>
              <div className="mono text-[11px] mb-5 uppercase tracking-[0.15em]" style={{ color: "#9a8a74" }}>Punch in · re-cut · dial it in</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
                {REVISION_PRESETS.map((preset) => {
                  const busy = regenerating === preset.key;
                  const anyBusy = regenerating !== null;
                  return (
                    <button key={preset.key} onClick={() => regenerateLetter(preset.key)} disabled={anyBusy} className="track-btn text-left p-3" style={{ background: busy ? "#2a1f14" : "#15110d", border: `1px solid ${busy ? "#e8841a" : "#2a2420"}`, borderRadius: 2, opacity: anyBusy && !busy ? 0.4 : 1, cursor: anyBusy ? "wait" : "pointer" }}>
                      <div className="flex items-center gap-2">
                        {busy && <Loader2 size={12} className="animate-spin text-[#e8841a]" />}
                        <div className="display text-[16px]" style={{ color: busy ? "#ffb347" : "#e8e0d2", letterSpacing: "0.04em" }}>{preset.label}</div>
                      </div>
                      <div className="mono text-[9px] mt-1 uppercase tracking-[0.1em]" style={{ color: busy ? "#c8b89a" : "#6a5f4e" }}>{preset.sub}</div>
                    </button>
                  );
                })}
              </div>
              <div>
                <div className="mono text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: "#9a8a74" }}>Custom note</div>
                <div className="flex gap-2">
                  <div className="flex-1 p-3" style={{ background: "#0a0806", border: "1px solid #2a2420", borderRadius: 2 }}>
                    <input type="text" value={customTweak} onChange={(e) => setCustomTweak(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !regenerating && customTweak.trim()) { handleCustomTweak(); } }} placeholder="e.g. 'mention the Korg more', 'less about live work', 'sound more like me'" />
                  </div>
                  <button onClick={handleCustomTweak} disabled={!!regenerating || !customTweak.trim()} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase px-4 flex items-center gap-2" style={{ opacity: !customTweak.trim() || regenerating ? 0.4 : 1, cursor: regenerating ? "wait" : customTweak.trim() ? "pointer" : "not-allowed" }}>
                    {regenerating === "custom" ? <><Loader2 size={11} className="animate-spin" />Cutting</> : <><Sparkles size={11} />Apply</>}
                  </button>
                </div>
              </div>
            </section>

            <section className="panel p-6 md:p-8 mb-5" style={{ borderRadius: 2 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a]">B-side</div>
                <div className="flex-1 h-px bg-[#3a2e22]" />
                <button onClick={() => copyToClipboard(result.cvRecommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join("\n\n"), "recs")} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 flex items-center gap-2">{copiedKey === "recs" ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}</button>
              </div>
              <div className="display text-[28px] mb-1" style={{ color: "#f5ead6", letterSpacing: "0.04em" }}>Notes on the CV</div>
              <div className="mono text-[11px] mb-5 uppercase tracking-[0.15em]" style={{ color: "#9a8a74" }}>Engineer's notes · tune for this gig</div>
              <ol className="space-y-4">
                {result.cvRecommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="display flex-shrink-0" style={{ fontSize: 20, color: "#e8841a", letterSpacing: "0.05em", minWidth: 32, paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="sans" style={{ fontSize: 15, lineHeight: 1.65, color: "#e8e0d2" }}>{rec}</span>
                  </li>
                ))}
              </ol>
            </section>

            {result.bulletRewrites && result.bulletRewrites.length > 0 && (
              <section className="panel p-6 md:p-8 mb-5" style={{ borderRadius: 2 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a]">Hidden track</div>
                  <div className="flex-1 h-px bg-[#3a2e22]" />
                </div>
                <div className="display text-[28px] mb-1" style={{ color: "#f5ead6", letterSpacing: "0.04em" }}>Bullets, re-cut</div>
                <div className="mono text-[11px] mb-5 uppercase tracking-[0.15em]" style={{ color: "#9a8a74" }}>Raw takes → final mix</div>
                <div className="space-y-4">
                  {result.bulletRewrites.map((b: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-2" style={{ background: "#0a0806", border: "1px solid #2a2420", borderRadius: 2, overflow: "hidden" }}>
                      <div className="p-5" style={{ borderRight: "1px solid #2a2420" }}>
                        <div className="mono text-[10px] tracking-[0.25em] uppercase mb-2 flex items-center gap-2" style={{ color: "#6a5f4e" }}><div className="w-1.5 h-1.5 rounded-full bg-[#6a5f4e]" />Raw take</div>
                        <div className="mono" style={{ fontSize: 13, lineHeight: 1.6, color: "#9a8a74" }}>{b.original}</div>
                      </div>
                      <div className="p-5">
                        <div className="mono text-[10px] tracking-[0.25em] uppercase mb-2 flex items-center gap-2" style={{ color: "#e8841a" }}><div className="w-1.5 h-1.5 rounded-full led" />Final mix</div>
                        <div className="sans" style={{ fontSize: 15, lineHeight: 1.6, color: "#f5ead6", fontWeight: 500 }}>{b.rewritten}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <footer className="mt-10 pt-6 border-t border-[#2a2420]">
          <div className="flex justify-between flex-wrap gap-2 mono text-[10px] tracking-[0.2em] uppercase engraved">
            <span>Studio J · Built for Josh · Powered by Claude</span>
            <span>First pass — final mix is yours</span>
          </div>
        </footer>
      </div>

      {settingsOpen && (
        <div className="drawer-backdrop fixed inset-0 z-40" style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)" }} onClick={() => setSettingsOpen(false)}>
          <div className="drawer-panel absolute right-0 top-0 bottom-0 w-full md:w-[560px] overflow-y-auto" style={{ background: "#0e0c0a", borderLeft: "1px solid #2a2420" }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Radio size={18} className="text-[#e8841a]" />
                  <div>
                    <div className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a] mb-1">Patch bay</div>
                    <h2 className="display text-[32px]" style={{ color: "#f5ead6", letterSpacing: "0.04em" }}>The Console</h2>
                  </div>
                </div>
                <button onClick={() => setSettingsOpen(false)} className="ghost-btn p-2"><X size={16} /></button>
              </div>
              <div className="h-px bg-[#2a2420] mb-6" />

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a] flex items-center gap-2"><FileText size={11} />Channel 1 · CV</label>
                  <div className="flex items-center gap-3">
                    {uploadedFilename && <div className="mono text-[10px] text-[#9a8a74] flex items-center gap-1.5 max-w-[160px]"><span className="truncate">{uploadedFilename}</span></div>}
                    <div className="mono text-[10px] text-[#6a5f4e]">{cv.length} chars</div>
                  </div>
                </div>

                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.md" onChange={handleFileUpload} style={{ display: "none" }} />

                <div className="flex gap-2 mb-3">
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="ghost-btn mono text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 px-4 py-2.5 flex-1 justify-center" style={{ opacity: uploading ? 0.6 : 1, cursor: uploading ? "wait" : "pointer" }}>
                    {uploading ? <><Loader2 size={12} className="animate-spin" /> Loading...</> : <><Upload size={12} /> Load file (PDF / DOCX)</>}
                  </button>
                  {cv && <button onClick={() => { setCv(""); setUploadedFilename(""); }} className="ghost-btn flex items-center gap-2 px-3 py-2.5" title="Clear"><Trash2 size={12} /></button>}
                </div>

                <div className="p-4" style={{ background: "#0a0806", border: "1px solid #2a2420", minHeight: 280, borderRadius: 2 }}>
                  <textarea value={cv} onChange={(e) => { setCv(e.target.value); if (uploadedFilename) setUploadedFilename(""); }} placeholder="Load a file above, or paste your full CV. Experience, credits, education, skills, gear, DAWs, the lot." rows={14} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="mono text-[10px] tracking-[0.25em] uppercase text-[#e8841a] flex items-center gap-2"><Music size={11} />Channel 2 · Credits & links</label>
                  <button onClick={addLink} className="ghost-btn mono text-[9px] tracking-[0.2em] uppercase flex items-center gap-1.5 px-2.5 py-1.5"><Plus size={10} /> Add</button>
                </div>
                {links.length === 0 && <div className="p-4 mono text-[12px] italic" style={{ background: "#0a0806", border: "1px dashed #2a2420", color: "#6a5f4e", borderRadius: 2 }}>Bandcamp, Spotify, SoundCloud, specific credits. The desk picks the one most relevant to each gig.</div>}
                <div className="space-y-3">
                  {links.map((link, i) => (
                    <div key={i} className="p-3 space-y-2" style={{ background: "#0a0806", border: "1px solid #2a2420", borderRadius: 2 }}>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full led flex-shrink-0" />
                        <input type="text" value={link.label} onChange={(e) => updateLink(i, "label", e.target.value)} placeholder="Label (e.g. Bandcamp, Warts N' All)" style={{ flex: 1 }} />
                        <button onClick={() => removeLink(i)} className="ghost-btn p-1.5 flex-shrink-0"><Trash2 size={11} /></button>
                      </div>
                      <input type="url" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} placeholder="https://..." />
                      <input type="text" value={link.note} onChange={(e) => updateLink(i, "note", e.target.value)} placeholder="When to use (e.g. 'for mixing roles')" />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={saveProfile} className="record-btn w-full flex items-center justify-center gap-3 py-4" style={{ background: savedFlash ? "linear-gradient(180deg, #22c55e 0%, #0a5f26 100%)" : undefined, boxShadow: savedFlash ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 0 #083b18" : undefined, borderRadius: 2 }}>
                {savedFlash ? <><Check size={16} /><span className="display text-[20px] tracking-[0.08em]">Locked in</span></> : <><Save size={14} /><span className="display text-[20px] tracking-[0.08em]">Commit to tape</span></>}
              </button>

              <div className="mono text-[9px] tracking-[0.2em] uppercase mt-4 text-center" style={{ color: "#6a5f4e" }}>Stored privately in your browser</div>
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
    lhView.setUint32(0, 0x04034b50, true);
    lhView.setUint16(4, 20, true);
    lhView.setUint16(6, 0, true);
    lhView.setUint16(8, 0, true);
    lhView.setUint16(10, 0, true);
    lhView.setUint16(12, 0, true);
    lhView.setUint32(14, crc, true);
    lhView.setUint32(18, size, true);
    lhView.setUint32(22, size, true);
    lhView.setUint16(26, nameBytes.length, true);
    lhView.setUint16(28, 0, true);
    lhBytes.set(nameBytes, 30);

    const centralHeader = new ArrayBuffer(46 + nameBytes.length);
    const chView = new DataView(centralHeader);
    const chBytes = new Uint8Array(centralHeader);
    chView.setUint32(0, 0x02014b50, true);
    chView.setUint16(4, 20, true);
    chView.setUint16(6, 20, true);
    chView.setUint16(8, 0, true);
    chView.setUint16(10, 0, true);
    chView.setUint16(12, 0, true);
    chView.setUint16(14, 0, true);
    chView.setUint32(16, crc, true);
    chView.setUint32(20, size, true);
    chView.setUint32(24, size, true);
    chView.setUint16(28, nameBytes.length, true);
    chView.setUint16(30, 0, true);
    chView.setUint16(32, 0, true);
    chView.setUint16(34, 0, true);
    chView.setUint16(36, 0, true);
    chView.setUint32(38, 0, true);
    chView.setUint32(42, offset, true);
    chBytes.set(nameBytes, 46);

    fileRecords.push(lhBytes);
    fileRecords.push(contentBytes);
    centralRecords.push(chBytes);
    offset += lhBytes.length + contentBytes.length;
  }

  const centralSize = centralRecords.reduce((a, b) => a + b.length, 0);
  const centralOffset = offset;

  const eocd = new ArrayBuffer(22);
  const eocdView = new DataView(eocd);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);
  eocdView.setUint16(6, 0, true);
  eocdView.setUint16(8, files.length, true);
  eocdView.setUint16(10, files.length, true);
  eocdView.setUint32(12, centralSize, true);
  eocdView.setUint32(16, centralOffset, true);
  eocdView.setUint16(20, 0, true);

  const parts = [...fileRecords, ...centralRecords, new Uint8Array(eocd)];
  return new Blob(parts, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
}
