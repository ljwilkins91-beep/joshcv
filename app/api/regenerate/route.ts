import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server missing ANTHROPIC_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const { coverLetter, cv, jobDesc, instruction } = await request.json();
    if (!coverLetter || !instruction) {
      return NextResponse.json(
        { error: "Missing coverLetter or instruction" },
        { status: 400 }
      );
    }

    const prompt = `You are revising a cover letter for Josh Wilkins (drummer, producer, mixer, mastering engineer). Return STRICT JSON only. No prose, no markdown, no code fences.

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
  "coverLetter": "string"
}

=== CURRENT LETTER ===
${coverLetter}

=== JOB DESCRIPTION (for reference) ===
${jobDesc || ""}

=== CV (for reference, do not invent beyond this) ===
${cv || ""}`;

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
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
      { error: "Revision failed", detail: e?.message || "unknown" },
      { status: 500 }
    );
  }
}
