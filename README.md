# OneClick Tools

Free online calculators, converters and developer utilities. Next.js 14 (App Router), Tailwind, Framer Motion.

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Put it on GitHub
Create an empty repo named `oneclick-tools` on github.com (no README), then:
```bash
git init -b main
git add .
git commit -m "Initial commit: OneClick Tools"
git remote add origin https://github.com/<your-username>/oneclick-tools.git
git push -u origin main
```
GitHub CLI shortcut: `gh repo create oneclick-tools --private --source=. --push`

## Deploy on Vercel
1. vercel.com > Add New > Project > import the repo (framework: Next.js, no settings to change).
2. Add the variables from `.env.example` under Settings > Environment Variables.
3. Add your domain under Settings > Domains. The daily blog cron is defined in `vercel.json`.
