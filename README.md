# plintoo-web

The public site for plintoo.app. Next.js (App Router), deployed on Vercel.

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

- `app/page.tsx`: the landing page. `app/globals.css`: styles, following `plintoo/DESIGN.md`.
- `components/Navbar.tsx`: menu after the DEIXIS site navbar. `components/Dial.tsx`: the "one place" dial. `components/Effects.tsx`: scroll motion.
- `public/manifesto-v11.mp4`: the manifesto film, v11 (vertical, 6 Nov 2026). `public/london.png`: hero map.
- Fonts are self-hosted through `@fontsource` packages, so the site makes no calls to Google.
- Work on `dev`, merge into `main` to go live. Open items before launch: bottom of `LAUNCH_PRD.md`.
