import { NextResponse } from "next/server";
import { resolveModel } from "@/lib/models";

export const runtime = "nodejs";
export const maxDuration = 60;

function letterPrompt(currentText: string, cv: string, jobDesc: string, instruction: string) {
  return `You are revising a COVER LETTER for Josh Wilkins (drummer, producer, mixer, mastering engineer). Return STRICT JSON only. No prose, no markdown, no code fences.

The existing letter is below. Revise it according to the instruction.

IMPORTANT — keep all these rules:
- British English (organise, colour, whilst, realise)
- Neutral professional register, never salesy
- Do NOT invent facts, credits, artists, venues, metrics, or qualifications not in the CV
- Opening: the letter should use a clear, standard opening line that states the role (patterns like "I'm writing regarding the [role] position at [Company]" or "I'd like to apply for the [role] position"). Josh prefers a grounded, conventional opening over creative hooks.
- Banned: "passionate", "please find attached", "I believe I would be a great fit", "wear many hats", "team player", "synergy", "go-getter", "self-starter", "proven track record", "thrilled", "excited to", em-dashes or en-dashes (— –)
- No date, no addresses, no letterhead. Keep the "Dear ..." opening and "Best, Josh Wilkins" sign-off.
- If a portfolio link is woven in, keep the most relevant one naturally; don't dump the list.

INSTRUCTION FOR THIS REVISION:
${instruction}

Return JSON in exactly this shape:
{
  "text": "string"
}

=== CURRENT LETTER ===
${currentText}

=== JOB DESCRIPTION (for reference) ===
${jobDesc || ""}

=== CV (for reference, do not invent beyond this) ===
${cv || ""}`;
}

function cvPrompt(currentText: string, cv: string, jobDesc: string, instruction: string) {
  return `You are revising a TAILORED CV for Josh Wilkins (drummer, producer, mixer, mastering engineer). Return STRICT JSON only. No prose, no markdown, no code fences.

The existing tailored CV is below. Revise it according to the instruction.

IMPORTANT — keep all these rules:
- British English (organise, colour, whilst, realise)
- Do NOT invent roles, credits, artists, venues, dates, metrics, qualifications, or skills. Use only what is in the SOURCE CV below. If the instruction asks for something the source doesn't support, do the best you can with what is truthfully there.
- Keep it a COMPLETE, ready-to-send CV — the full document, not notes about it.
- Plain text, ATS-friendly: no tables, no columns, no graphics, no markdown. A name and title block at the top, UPPERCASE section headers on their own lines, "- " bullets under roles, a single blank line between sections.
- Banned: "passionate", "wear many hats", "team player", "synergy", "go-getter", "self-starter", "proven track record", em-dashes or en-dashes (— –)
- Return the whole CV as one string, using \n for line breaks.

INSTRUCTION FOR THIS REVISION:
${instruction}

Return JSON in exactly this shape:
{
  "text": "string"
}

=== CURRENT TAILORED CV (revise this) ===
${currentText}

=== JOB DESCRIPTION (for reference) ===
${jobDesc || ""}

=== SOURCE CV (do not invent beyond this) ===
${cv || ""}`;
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
    const { kind, currentText, cv, jobDesc, instruction, model } = await request.json();
    if (!currentText || !instruction) {
      return NextResponse.json(
        { error: "Missing text or instruction" },
        { status: 400 }
      );
    }

    const isCv = kind === "cv";
    const prompt = isCv
      ? cvPrompt(currentText, cv, jobDesc, instruction)
      : letterPrompt(currentText, cv, jobDesc, instruction);

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: resolveModel(model),
        max_tokens: isCv ? 3500 : 2000,
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

    return NextResponse.json({ text: parsed.text });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Revision failed", detail: e?.message || "unknown" },
      { status: 500 }
    );
  }
}
