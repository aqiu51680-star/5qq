# 5qq — Local dev & Vercel deployment

This repository is a Vite + React + Supabase app. Below are concise instructions to run locally and deploy to Vercel.

## Required environment variables

- `VITE_SUPABASE_URL` — your Supabase project URL (e.g. `https://xyzabc.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key

These variables must be available at build time (Vite) and runtime. Locally, create a `.env.local` file in the project root with:

```ini
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your_anon_key...
```

## Run locally

Prerequisites: Node.js (16+ recommended)

1. Install dependencies:

```bash
npm install
```

2. Add `.env.local` as shown above.

3. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

If the app cannot find the Supabase variables it will render a helpful configuration screen (instead of a white page) describing the required keys.

## Deploy to Vercel (recommended)

1. Connect the GitHub repository to Vercel (if you haven't already).

2. In the Vercel Dashboard, open your project → **Settings** → **Environment Variables** and add the two keys:

   - `VITE_SUPABASE_URL` → your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key

   Add them for the appropriate environments (Preview and Production).

3. Trigger a redeploy (Deployments → Redeploy) or push a new commit to `main`.

### Vercel CLI alternative

If you prefer CLI:

```bash
npm i -g vercel
vercel login
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel --prod
```

## Notes & Troubleshooting

- Do NOT use the Tailwind CDN in production — the project builds Tailwind via PostCSS. We removed the CDN include from `index.html` so the bundled CSS is used instead.
- If you see `Supabase URL or Key not found` or `supabaseUrl is required`, confirm the environment variables are set in Vercel and that the redeploy completed.
- After deployment, open the browser console and Vercel build logs for errors. If the app shows a configuration screen on the deployed site, it means the env vars are missing at build time.

## Quick checklist

- [ ] `VITE_SUPABASE_URL` added to Vercel env
- [ ] `VITE_SUPABASE_ANON_KEY` added to Vercel env
- [ ] Redeploy on Vercel

If you'd like, I can:
- Walk you through setting the variables in the Vercel Dashboard step-by-step, or
- Provide the exact CLI commands for your environment.
