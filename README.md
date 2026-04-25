# Studio J — Cover Letter App for Josh

A personalised cover-letter generator. Built on Next.js, deployed on Vercel, powered by Claude.

## Deploy it (no terminal needed)

You'll do three things: put the code on GitHub, connect GitHub to Vercel, set three secret values. Total time: about 15 minutes.

---

### Step 1 — Get the code onto GitHub

1. Go to **https://github.com** and sign in (or create a free account).
2. Click the **+** in the top-right → **New repository**.
3. Name it `studio-j` (or anything else). Leave it **Private**. Click **Create repository**.
4. On the next page, find the section that says **"uploading an existing file"** and click that link.
5. **Drag the entire contents of this folder** into the upload zone — every file and folder you see in this project. *Don't drag the folder itself, drag the files inside it.* Make sure to include the `app`, `lib`, and `public` folders.
6. At the bottom, click **Commit changes**.

You should now see all your files listed on the GitHub repo page.

---

### Step 2 — Get three values ready

Before connecting to Vercel, have these three things in a notepad:

1. **`ANTHROPIC_API_KEY`** — your Claude API key. Get one at https://console.anthropic.com → API Keys → Create Key. Copy it (starts with `sk-ant-...`).
2. **`APP_PASSWORD`** — make up a password for Josh. Anything you want, e.g. `glassmantra2026`.
3. **`SESSION_SECRET`** — a long random string. Easiest way: open https://1password.com/password-generator/, set it to 40+ characters, click generate, copy that.

---

### Step 3 — Deploy to Vercel

1. Go to **https://vercel.com** → **Sign Up** → choose **Continue with GitHub**. Authorise it.
2. On your Vercel dashboard, click **Add New** → **Project**.
3. Find the `studio-j` repo in the list and click **Import**.
4. On the configuration page, expand **Environment Variables** and add these three:

   | Name | Value |
   |------|-------|
   | `ANTHROPIC_API_KEY` | `sk-ant-...` (the key you copied) |
   | `APP_PASSWORD` | the password you made up |
   | `SESSION_SECRET` | the long random string |

5. Leave everything else at the defaults. Click **Deploy**.
6. Wait two or three minutes. Vercel builds the site.
7. When it's done, click **Continue to Dashboard** → click **Visit** at the top of the project page. You'll get a URL like `studio-j.vercel.app`.

That's the live site. Send the URL and the password to Josh.

---

### Custom domain (optional)

If you want it on `studio-j.something.com`:

1. From your Vercel project page → **Settings** → **Domains**.
2. Type the domain you want and follow Vercel's instructions for adding the DNS record at your domain registrar.

---

## Costs

- **Vercel:** free for this scale.
- **Anthropic API:** pay per use. Each cover letter generation costs roughly £0.05–£0.15 depending on length. The password gate prevents anyone else burning your credits.

You can set a spending cap in the Anthropic console under **Settings** → **Limits**.

---

## Updating the app later

Want to change the greetings, add a feature, swap the model? Edit the file on GitHub directly (or have me regenerate the file for you), commit it, and Vercel auto-redeploys within a minute.

---

## Files at a glance

- `app/page.tsx` — the Studio J UI
- `app/login/page.tsx` — the password gate
- `app/api/generate/route.ts` — calls Claude for first-pass letter
- `app/api/regenerate/route.ts` — calls Claude for revisions
- `app/api/login/route.ts` — checks password, sets cookie
- `middleware.ts` — protects every route except `/login`
- `lib/auth.ts` — cookie signing/verification
