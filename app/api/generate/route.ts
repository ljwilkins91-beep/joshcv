import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const JOB_TYPE_GUIDANCE: Record<string, string> = {
  session:
    "This is a SESSION DRUMMING gig. Emphasise reliability, reading ability, groove, versatility across styles, studio etiquette, and any named artists or credits. Musicians hiring drummers care about feel and professionalism above all.",
  engineering:
    "This is a STUDIO / ENGINEERING role (mixing, mastering, producing). Emphasise technical craft, relevant gear and DAWs, specific projects or artists, attention to detail, and taste. Avoid puffery; engineers respect understatement and specifics.",
  teaching:
    "This is a MUSIC TEACHING role. Emphasise patience, pedagogical approach, experience with students at relevant levels, and love of the instrument. Keep it warm but grounded.",
  industry:
    "This is a MUSIC INDUSTRY role (label, publishing, A&R, etc.). Emphasise taste, ears, network, understanding of artists from the inside, and any organisational or commercial experience. Show the perspective of someone who knows the creative side.",
};

function buildPrompt(cv: string, jobDesc: string, links: any[], jobType: string) {
  const typeInstruction =
    jobType === "auto"
      ? `First, determine which category this job falls into based on the job description: "session" (live/recording drumming gigs), "engineering" (studio work — mixing, mastering, producing, audio editing), "teaching" (music tuition), "industry" (label, publishing, A&R, management, music business), or "other". Then tailor the letter for that category using this guidance:\n\nSession: ${JOB_TYPE_GUIDANCE.session}\nEngineering: ${JOB_TYPE_GUIDANCE.engineering}\nTeaching: ${JOB_TYPE_GUIDANCE.teaching}\nIndustry: ${JOB_TYPE_GUIDANCE.industry}\n\nReturn your classification in the "detectedType" field.`
      : `${JOB_TYPE_GUIDANCE[jobType] || ""}\n\nReturn "${jobType}" in the "detectedType" field.`;

  const linksBlock =
    Array.isArray(links) && links.length > 0
      ? `\n=== PORTFOLIO LINKS (include only if genuinely relevant to the role — don't force them) ===\n${links
          .map((l) => `- ${l.label}: ${l.url}${l.note ? ` (${l.note})` : ""}`)
          .join("\n")}`
      : "";

  return `You are helping Josh Wilkins — a drummer, producer, mixer, and mastering engineer — apply for a job. Return STRICT JSON only. No prose, no markdown, no code fences.

${typeInstruction}

Voice & register:
- Use BRITISH English throughout (organise, colour, whilst, realise, etc.)
- Neutral professional register — not salesy, not try-hard, not overly warm
- Match Josh's own voice: understated, craft-focused, concrete, confident without performing confidence
- Short to medium sentences. No purple prose.

Banned words and phrases (never use these):
- "passionate", "passion for"
- "please find attached"
- "I believe I would be a great fit"
- "wear many hats"
- "team player", "synergy", "go-getter", "self-starter"
- "proven track record"
- "thrilled", "excited to"
- Em-dashes or en-dashes (—, –). Use commas, full stops, or colons instead.

Cover letter rules:
- 300-400 words, 3-4 paragraphs
- Opening: use a CLEAR, STANDARD opening line that states the role being applied for. Acceptable patterns include "I'm writing regarding the [role] position at [Company]", "I'd like to apply for the [role] position", "I'm applying for the [role] advertised...". Do NOT open with a creative hook, a quote, a question, an anecdote, or an observation about the company. First sentence states the role and (where it flows naturally) the company. Josh prefers a grounded, conventional opening.
- After the opening sentence, the second sentence can be the actual hook that connects him to the role
- Reference 2-3 specific things from the job description and tie them to concrete items in Josh's CV
- If a portfolio link from the list above is genuinely relevant, work ONE into the letter naturally (e.g. "my mixing work on X is at [link]"). Never dump all of them.
- Do NOT invent credits, artists, venues, qualifications, or metrics not present in the CV
- No date, no addresses, no letterhead — start with "Dear [Hiring Manager]" (or a name if obvious from the JD) through to sign-off "Best, Josh Wilkins"

CV recommendations rules:
- 4-6 specific, actionable recommendations tied to THIS job
- Not generic ("use action verbs") — JD-specific ("Move the X credit higher since the brief asks for Y")

Bullet rewrites rules:
- Pick 3-5 bullets from the CV that could be tighter or better targeted
- Give original (verbatim from CV) and rewritten version
- Rewrites must stay truthful — sharpen language, lead with impact, only quantify if number is already implied
- If CV has no clear bullets, return empty array

Return JSON in exactly this shape:
{
  "detectedType": "session" | "engineering" | "teaching" | "industry" | "other",
  "coverLetter": "string",
  "cvRecommendations": ["string", ...],
  "bulletRewrites": [{ "original": "string", "rewritten": "string" }, ...]
}

=== JOB DESCRIPTION ===
${jobDesc}

=== CV ===
${cv}${linksBlock}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server missing ANTHROPIC_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const { cv, jobDesc, links, jobType } = await request.json();
    if (!cv || !jobDesc) {
      return NextResponse.json({ error: "Missing CV or job description" }, { status: 400 });
    }

    const prompt = buildPrompt(cv, jobDesc, links || [], jobType || "auto");

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      return NextResponse.json(
        { error: "Claude API error", detail: errText },
        { status: 502 }
      );
    }

    const data = await claudeRes.json();
    const text = (data.content || [])
      .map((b: any) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return NextResponse.json(
        { error: "Couldn't parse the response. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Generation failed", detail: e?.message || "unknown" },
      { status: 500 }
    );
  }
}
