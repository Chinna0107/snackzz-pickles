# Snakzee 🌿

**Snakzee** is a beautifully crafted Next.js Vercel-ready e-commerce landing application that promotes authentic, homemade Telangana snacks, sun-dried *vadiyalu*, masalas, and sweets to customers across India.

With local culture and traditions encoded into the UI, Snakzee emphasizes freshness, quality, and a 100% natural approach to snacks preparation without preservatives or factory bottlenecks. Orders are friction-free, instantly routing the curated baskets directly to WhatsApp for organic processing.

## 🚀 Key Features

- **Modern Tech Stack**: Hand-crafted using `Next.js 15+` (App Router & Turbopack), React 18, and styled with `Tailwind CSS`.
- **Framer Motion**: Smooth, high-performance scroll reveal and layout animations for the highest standard of UI experience.
- **Glassmorphism Aesthetics**: Premium warm-brand interfaces using `.glass-card` and deeply integrated CSS overlays to emulate organic traditions in a digital age.
- **Dynamic Catalog**: The product index is cleanly structured around internal categories (Hot Items, Sweet Items, Podis, Vadiyalu) localized with bilingual text rendering (English + Telugu context).
- **SEO Ready**: Integrates automated JSON-LD schema linking, exact click-oriented metadata strings, optimized layout HTML wrappers, and crawler-ready route manifests.
- **Vercel Enabled**: Plug-and-play architecture out-of-the-box perfectly set up to be deployed instantly on Vercel without tweaking configuration files.

## 🛠️ Project Setup Instructions

Ensure your environment handles the latest Node.js versions (>= 18 for Next.js). Open your terminal inside the project root directory.

### 1. Install Dependencies
```bash
npm install
```

### 2. Local Development 
To boot up the native Turbopack developer environment (starts rapidly):
```bash
npm run dev
```

The application will bind to `localhost:3000` internally.

### 3. Build & Validate
To verify that everything is optimized strictly without any hydration loops or SSR bugs natively:
```bash
npm run build
```

This ensures full linting and optimized page static bundling is executed seamlessly.

## 📦 Deployment to Vercel

Snakzee is tightly coupled to modern Vercel-compatible serverless routines. 
Deploying live takes seconds:
1. Push this newly committed local branch to your GitHub repository.
2. Sign in to your Vercel Dashboard.
3. Import the exact GitHub directory `Snakzee`.
4. Deploy using the auto-detected `Next.js` wrapper configuration constraints!

## 🌿 The Structure

- `/src/lib/products.ts`: Single-Source-of-Truth database housing 44 catalogue products, FAQ mappings, combis, and global constants (like the active WhatsApp redirect URI `+91 9505550051`).
- `/src/app/page.tsx`: A hyper-customized monolithic home component containing modular structural chunks (Navbars, Heroes, How It's Made timelines, etc.).
- `/src/app/globals.css`: Powerful styling system overriding standard Tailwind sets with advanced Glassmorphic rules and animations natively scoped to `.glass-card`, `.process-dot`, `.badge-shimmer`, etc.

## 👨‍💻 Powered by Snakzee Team
Developed and maintained completely under homemade conditions for authenticity. We handle orders personally with pride.
